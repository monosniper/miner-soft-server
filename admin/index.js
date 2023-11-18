import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
// import jsRealTimeSearch from 'https://cdn.jsdelivr.net/npm/js-real-time-search@1.2.1/+esm'

const SERVER = "188.116.20.163"
// const SERVER = "localhost"

// const socket = io("localhost:1337");
const socket = io(`${SERVER}:5000`);

const totalEl = document.querySelector('#total')
const onlineEl = document.querySelector('#online')
const users = document.querySelector('#users')

let total = 0
let online = 0

function updateCounts() {
    totalEl.innerText = total
    onlineEl.innerText = online
}

// new jsRealTimeSearch({
//     input_selector: '#search',
//     item_selector: '.user',
//     item_title_selector: '.user__name',
//     item_title_el_selector: 'span',
//     hide_class: 'user_hide',
// })

function fetchUsers() {
    users.innerHTML = ''

    fetch(`http://${SERVER}:5000/api/users`).then(rs => rs.json()).then(rs => {
		total = rs.length
		updateCounts()

		rs.forEach(user => {
			users.innerHTML += `
			<div class="user" id="user-${user.id}">
				<div class="user__wrapper">
				<div class="col user__name">
					${user.status === 'demo' ? '<span class="demo badge">DEMO</span>' : ''}
					${user.status === 'default' ? '<span class="default badge">Default</span>' : ''}
					${user.status === 'pro' ? '<span class="pro badge">PRO</span>' : ''}
					<span class="username">${user.name}</span>
				</div>
				<div class="col user__username">@${user.username}</div>
				<div class="col user__refs">${user.refs_count}</div>
				<div class="col user__balance">${user.balance.usdt?.toFixed(2)} USDT</div>
				<div class="col">
					<div class="user__online"></div>
					${user.status === 'default' ? '' : `<button data-type="default" class="make btn btn_sm" data-id="${user.id}">Make default</button>`}
					${user.status === 'pro' ? '' : `<button data-type="pro" class="make btn btn_sm" data-id="${user.id}">Make PRO</button>`}
					<button class="reset btn btn_sm" data-id="${user.id}">Reset balance</button>
					<button class="delete btn btn_sm" data-id="${user.id}">Delete</button>
				</div>
				</div>
			</div>
			`
		})

		document.querySelectorAll('.reset').forEach(btn => {
			btn.onclick = () => {
				btn.classList.add('confirm')

				btn.onclick = () => {
					fetch(`http://${SERVER}:5000/api/balance/admin`, {
					method: 'put',
					body: JSON.stringify({
						id: btn.getAttribute('data-id'),
						balance: {
						btc: 0,
						eth: 0,
						doge: 0,
						ton: 0,
						usdt: 0,
						}
					}),
					headers: {
						'Content-Type': 'application/json'
					}
					}).then(rs => rs.json()).then(rs => {
					new Noty({
						type: 'success',
						theme: 'nest',
						text: 'Saved!',
					}).show();

					fetchUsers()
					})
				}
			}
		})

		document.querySelectorAll('.delete').forEach(btn => {
			btn.onclick = () => {
				btn.classList.add('confirm')

				btn.onclick = () => {
					fetch(`http://${SERVER}:5000/api/users/${btn.getAttribute('data-id')}`, {
						method: 'delete',
					}).then(rs => rs.json()).then(rs => {
						new Noty({
							type: 'success',
							theme: 'nest',
							text: 'Deleted!',
						}).show();

						// fetchUsers()
						const user = btn.parentNode.parentNode.parentNode
						user.parentNode.removeChild(user)
					})
				}
			}
		})

		document.querySelectorAll('.make').forEach(btn => {
			btn.onclick = () => {
				fetch(`http://${SERVER}:5000/api/make/${btn.getAttribute('data-type')}`, {
					method: 'put',
					body: JSON.stringify({id: btn.getAttribute('data-id')}),
					headers: {
					'Content-Type': 'application/json'
					}
				}).then(rs => rs.json()).then(rs => {
					new Noty({
					type: 'success',
					theme: 'nest',
					text: 'Saved!',
					}).show();

					fetchUsers()
				})
				}
			})

		new RLSearch({
			input_selector: "#search",
			items: [
				{
					container_selector: '#users',
					selector: ".user",
					target_selector: ".user__username"
				}
			]
		})

	})
}

fetchUsers()

socket.on("connect", () => {
    socket.on("get", (data) => {
		document.querySelectorAll('.user__online').forEach(user => {
			user.classList.remove('online')
		})

		let _online = 0

		data.forEach(item => {
			if(item.session_id) {
				_online += 1

				const user = document.querySelector('#user-'+item.user.id)

				if(user) user.querySelector('.user__online').classList.add('online')
			}
		})

		online = _online
		updateCounts()
    })

    socket.emit("admin")
});

document.querySelectorAll('.tabs__item').forEach(btn => {
    btn.onclick = () => {
	document.querySelector('.tabs__item.active').classList.remove('active')
	btn.classList.add('active')
	document.querySelector('.tab.active').classList.remove('active')
	document.querySelector(`.tab[data-id=${btn.getAttribute('data-id')}]`).classList.add('active')
    }
})

const fields = document.querySelector('#fields')

fetch(`http://${SERVER}:5000/api/settings`).then(rs => rs.json()).then(settings => {
    settings.forEach(setting => {
	fields.innerHTML += `<div class="setting">
				<label class="label">${setting.key}</label>
				<input class="field" type="text" id="setting-${setting.key}" placeholder="${setting.key}" value="${setting.value}">
			     </div>`
    })

    document.querySelector('#setting-save').onclick = () => {
	fetch(`http://${SERVER}:5000/api/settings`, {
	    method: 'put',
	    body: JSON.stringify(Object.fromEntries(settings.map(s => [s.key, document.querySelector('#setting-'+s.key).value]))),
	    headers: {
		'Content-Type': 'application/json'
	    }
	}).then(rs => rs.json()).then(rs => {
	    new Noty({
		type: 'success',
		theme: 'nest',
		text: 'Saved!',
	    }).show();
	})
    }
})

class RLSearch {
	constructor(options={}) {
		// super();

		const default_options = {
			input_selector: '#search-input',
			items_limit: false,
			items: [],
		};

		this.options = extend(default_options, options);
		this.items = this.getItems();
		this.input_value = '';

		this.init();
	}

	init() {
		if (!RegExp.escape) {
			RegExp.escape = function (value) {
				return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&")
			};
		}

		const _this = this;
		this.input = document.querySelector(this.options.input_selector);

		_this.renderItems();

		this.input.addEventListener('input', function() {
			_this.input_value = RegExp.escape(this.value.trim().toLowerCase());

			_this.items.forEach((item, i) => {
				let pos = null;
				let len = null;

				if (_this.input_value !== '') {
					const text = item.target.innerText.trim();

					pos = text.toLowerCase().search(_this.input_value)

					console.log(text, pos)

					if (pos !== -1) {
						// _this.emit('found', item.element)

						len = _this.input_value.length;
					}
				}

				_this.items[i].pos = pos;
				_this.items[i].len = len;
			});

			_this.renderItems();
		});
	}

	renderItems() {
		const _this = this;
		console.log(this.items)
		this.items.forEach(items => {
			if(items.container) items.container.innerHTML = '';
		})

		let itemsToRender = [..._this.items];

		if(this.input_value !== '') itemsToRender = itemsToRender.sort((a,b) => a.pos - b.pos).filter(item => item.pos !== null);
		// if(this.options.items_limit) itemsToRender = itemsToRender.splice(0, _this.options.items_limit);

		itemsToRender.reverse().forEach(item => {
			item.container && item.container.append(item.element);

			const text = item.target.innerText.trim();

			item.target.innerHTML = _this.markResult(text, item.pos, item.len);
		})
	}

	getItems() {
		let items = [];

		function pushItems(details, elements, container) {
			elements.forEach(element => {
				const target = details.target_selector ? element.querySelector(details.target_selector) : element;

				items.push({
					container,
					element,
					target,
					pos: null,
					len: null,
				})
			})
		}

		this.options.items.forEach(details => {
			if(details.container_selector) {
				const containers = document.querySelectorAll(details.container_selector);

				containers.forEach(container => {
					pushItems(details, container.querySelectorAll(details.selector), container);
				})
			} else {
				pushItems(details, document.querySelectorAll(details.selector), null);
			}
		})

		return items;
	}

	markResult(string, pos, len) {
		const start = string.slice(0, pos);
		const mark = string.slice(pos, pos+len);
		const end = string.slice(pos+len);

		return `${start}<mark>${mark}</mark>${end}`;
	}
}

function extend(a, b) {
	for(let key in b)
		if(b.hasOwnProperty(key))
			a[key] = b[key];
	return a;
}