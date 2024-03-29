const {Server} = require("socket.io");
const User = require('./models/user-model')
const Setting = require('./models/setting-model')
const Session = require('./models/session-model')
const $config = require("./utils/config");

function generateWallet() {
    const length = 37;
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return "0х72С" + result;
}

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const filtered_coins = (coins) => Object.entries(coins).filter(([name, coin]) => coin.active)

const startSocketIOServer = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            // origin: "http://localhost:8100",
            methods: ["GET", "POST"],
            transports: ['websocket', 'polling'],
            credentials: true,
            origin: function (origin, callback) {
                callback(null, true)
            }
        },
        allowEIO3: true
    });

    io.on("connection", async (socket) => {
        console.log('new connection')

        const token = socket.handshake.auth.token || socket.handshake.headers.token;

        if (token) {
            const user = await User.findOne({where: {token}})

            if (user) {
                socket.data.user = user;

                const _demo_time = await Setting.findOne({where: {key: $config.demo_time}})
                let demo_time;

                if (_demo_time) {
                    demo_time = _demo_time.value
                } else {
                    demo_time = 600
                    console.error('Not defined setting ' + $config.demo_time)
                    console.error('Use 600 sec')
                }

                async function start(data) {
                    const checks = []
                    const founds = []
                    const logs = []

                    // Create session
                    const session = await Session.create({
                        user_id: socket.data.user.id,
                        data: {
                            logs: [],
                            checks: [],
                            founds: [],
                        }
                    })

                    socket.data.session_id = session.id

                    const getRandomCoin = () => data[Math.floor(Math.random() * data.length)]

                    let isSecond = false
                    let time = 0

                    function check(name, isSecond, time) {
                        setTimeout(async () => {
                            if (socket.data.session_id) {
                                checks.push({
                                    name: name.toUpperCase(),
                                    text: "Wallet Check: " + generateWallet()
                                })

                                function low() {
                                    // $ 1 - 15
                                    return randomIntFromInterval(10, 150) / 10
                                }

                                function middle() {
                                    // $ 15 - 100
                                    return randomIntFromInterval(150, 1000) / 10
                                }

                                function high() {
                                    // $ 100 - 500
                                    return randomIntFromInterval(1000, 5000) / 10
                                }

                                function freeLow() {
                                    // $ 0.01 - 0.1
                                    return randomIntFromInterval(0.1, 1) / 10
                                }

                                function freeMiddle() {
                                    // $ 0.1 - 5
                                    return randomIntFromInterval(1, 50) / 10
                                }

                                const list = socket.data.user.status === 'pro' ? [
                                    {chance: 0.1, func: low},
                                    {chance: 0.01, func: middle},
                                    {chance: 0.001, func: high}
                                ] : [
                                    {chance: 0.01, func: freeLow},
                                    {chance: 0.0002, func: freeMiddle},
                                ];

                                function callRandomFunction(list) {
                                    const rand = Math.random() // get a random number between 0 and 1
                                    let accumulatedChance = 0 // used to figure out the current

                                    const found = list.find(function (element) { // iterate through all elements
                                        accumulatedChance += element.chance // accumulate the chances
                                        return accumulatedChance >= rand // tests if the element is in the range and if yes this item is stored in 'found'
                                    })

                                    if (found) {
                                        const amount = found.func()

                                        if (amount) {
                                            founds.push({
                                                name: name.toUpperCase(),
                                                amount
                                            })
                                        }
                                    }
                                }

                                callRandomFunction(list)

                                const newData = {checks, founds, logs}

                                socket.emit("update", newData)

                                session.data = newData
                                session.save()

                                isSecond = !isSecond

                                if (isSecond) {
                                    time += 1
                                }

                                if (socket.data.user.status === 'demo') {
                                    if (time >= 60) {
                                        user.demo_time = user.demo_time + 60
                                        await user.save()

                                        time = 0
                                    }

                                    if (user.demo_time >= demo_time) {
                                        socket.emit("demo_expired")

                                        await session.destroy()

                                        socket.data.session_id = null

                                        // event for client to stop
                                        socket.emit("stopped")
                                    }
                                }

                                check(getRandomCoin(), isSecond, time)
                            }
                        }, socket.data.user.status === 'pro' ? 50 : 500)
                    }

                    check(getRandomCoin(), isSecond, time)

                    // event for client to start
                    socket.emit("started")
                }

                // Start pressed
                socket.on("start", async ({data}) => {
                    if (user.status === 'demo') {
                        if (user.demo_time >= demo_time) {
                            socket.emit("demo_expired")
                        } else await start(data)
                    } else await start(data)

                    console.log('Start event')
                });

                socket.on('stop', async () => {
                    if (socket.data.session_id) {
                        const session = await Session.findOne({where: {id: socket.data.session_id}})

                        user.demo_time = user.demo_time + session.createdAt.getSeconds()
                        await user.save()

                        await session.destroy()

                        socket.data.session_id = null

                        // event for client to stop
                        socket.emit("stopped")

                        if (user.demo_time >= demo_time) {
                            socket.emit("demo_expired")
                        }
                    }
                })
            } else {
                socket.disconnect()
            }
        }

        socket.on('admin', () => {
            setInterval(async () => {
                const all = await io.fetchSockets()

                socket.emit('get', all.map(s => s.data))
            }, 1000)
        })
    });
}

module.exports = startSocketIOServer