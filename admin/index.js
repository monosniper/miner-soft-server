import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import jsRealTimeSearch from 'https://cdn.jsdelivr.net/npm/js-real-time-search@1.2.1/+esm'

const socket = io("localhost:1337");
// const socket = io("188.116.20.163:1337");

const totalEl = document.querySelector('#total')
const onlineEl = document.querySelector('#online')
const users = document.querySelector('#users')

let total = 0
let online = 0

function updateCounts() {
    totalEl.innerText = total
    onlineEl.innerText = online
}

new jsRealTimeSearch({
    input_selector: '#search',
    item_selector: '.user',
    item_title_selector: '.user__name',
    item_title_el_selector: 'span',
    hide_class: 'user_hide',
})

fetch("http://127.0.0.1:5000/api/users").then(rs => rs.json()).then(rs => {
    total = rs.length
    updateCounts()

    rs.forEach(user => {
	users.innerHTML += `
	    <div class="user" id="user-${user.username}">
                <div class="user__wrapper">
		    <div class="col user__name"><span>${user.name}</span></div>
		    <div class="col user__username">@${user.username}</div>
		    <div class="col user__balance">0.00 USDT</div>
		    <div class="col"><div class="user__online"></div></div>
		</div>
            </div>
	`
    })
})

socket.on("connect", () => {
    socket.on("get", (data) => {
	document.querySelectorAll('.user__online').forEach(user => {
	    user.classList.remove('online')
	})

	let _online = 0

	data.forEach(item => {
	    if(item.session_id) {
		_online += 1

		const user = document.querySelector('#user-'+item.user.username)

		if(user) user.querySelector('.user__online').classList.add('online')
	    }
	})

	online = _online
	updateCounts()
    })

    socket.emit("admin")
});