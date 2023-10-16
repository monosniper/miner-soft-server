import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
// import jsRealTimeSearch from 'https://cdn.jsdelivr.net/npm/js-real-time-search@1.2.1/+esm'

const SERVER = "188.116.20.163"
// const SERVER = "localhost"

// const socket = io("localhost:1337");
const socket = io(`${SERVER}:1337`);

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
		<div class="user" id="user-${user.username}">
		    <div class="user__wrapper">
			<div class="col user__name">${user.isPro ? '<span class="pro">PRO</span>' : ''}<span>${user.name}</span></div>
			<div class="col user__username">@${user.username}</div>
			<div class="col user__refs">${user.refs_count}</div>
			<div class="col user__balance">${user.balance.usdt.toFixed(2)} USDT</div>
			<div class="col">
			    <div class="user__online"></div>
			    ${user.isPro ? '' : `<button class="make-pro btn btn_sm" data-id="${user.id}">Make PRO</button>`}
			</div>
		    </div>
		</div>
		`
	})

	document.querySelectorAll('.make-pro').forEach(btn => {
	    btn.onclick = () => {
		fetch(`http://${SERVER}:5000/api/pro`, {
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

		const user = document.querySelector('#user-'+item.user.username)

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
	fields.innerHTML += `<input class="field" type="text" id="setting-${setting.key}" placeholder="${setting.key}" value="${setting.value}">`
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