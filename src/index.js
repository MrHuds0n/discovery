import fetch from 'node-fetch'

const API = 'https://api.discoverygc.org/api'

export default class {
	constructor(options) {
		this.options = options || {}
		this.api = this.options.api || API

		if(this.options.key) {
			this.key = this.options.key
		}
		else {
			throw new Error('No key provided.')
		}
	}

	players(callback, timeout) {
		let timeoutHandle
		if(timeout) {
			timeoutHandle = setTimeout(() => {
				throw new Error('Operation timed out.')
			}, timeout)	
		}

		return fetch(`${this.api}/Online/GetPlayers/${this.key}`)
			.then(res => res.json())
			.then(json => {
				const data = JSON.parse(json)

				if(data.Error) throw new Error(data.Error)
				if(this.options.noFormat) return data

				let format = data.Players.map(el => {
					return {
						'name': el.Name,
						'system': el.System,
						'region': el.Region,
						'ping': el.Ping,
						'time': el.Time
					}
				})

				return {
					players: format,
					timestamp: new Date(data.Timestamp)
				}
			})
			.then(data => {
				clearTimeout(timeoutHandle)

				if(callback) {
					callback(data)
				}
				else return data
			})
	}

	factions(callback, timeout) {
		let timeoutHandle
		if(timeout) {
			timeoutHandle = setTimeout(() => {
				throw new Error('Operation timed out.')
			}, timeout)	
		}

		return fetch(`${this.api}/Online/GetFactionSummary/${this.key}`)
			.then(res => res.json())
			.then(json => {
				const data = JSON.parse(json)

				if(data.Error) throw new Error(data.Error)
				if(this.options.noFormat) return data

				let format = data.Factions.map(el => {
					let formatName = el.Name
					let unofficial = false
					let unofficialIndex = el.Name.indexOf('(Unofficial)')
					let openTag = false
					let openTagIndex = el.Name.indexOf('(Open tag)')
					
					if(unofficialIndex != -1) {
						formatName = formatName.substr(0, unofficialIndex).trim()
						unofficial = true
					}

					if(openTagIndex != -1) {
						formatName = formatName.substr(0, openTagIndex).trim()
						openTag = true
						unofficial = true
					}

					return {
						'tag': el.Tag,
						'name': formatName,
						'unofficial': unofficial,
						'openTag': openTag,
						'currentTime': el.Current_Time,
						'lastTime': el.Last_Time,
						'danger': el.Danger,
						'id': el.Id
					}
				})

				return {
					factions: format,
					timestamp: new Date(data.Timestamp)
				}
			})
			.then(data => {
				clearTimeout(timeoutHandle)

				if(callback) {
					callback(data)
				}
				else return data
			})
	}

	allPlayers(page, callback, timeout) {
		if(!page) throw new Error('No page specified (page is mandatory).')

		let timeoutHandle
		if(timeout) {
			timeoutHandle = setTimeout(() => {
				throw new Error('Operation timed out.')
			}, timeout)	
		}

		return fetch(`${this.api}/Online/GetAllPlayers/${this.key}/${page}`)
			.then(res => res.json())
			.then(json => {
				const data = JSON.parse(json)

				if(data.Error) throw new Error(data.Error)
				if(this.options.noFormat) return data

				let format = data.Characters.map(el => {
					return {
						'name': el.CharName,
						'currentTime': el.Current_Time,
						'lastTime': el.Last_Time
					}
				})

				return {
					players: format,
					lastPage: data.MaxPage,
					timestamp: new Date(data.Timestamp)
				}
			})	
			.then(data => {
				clearTimeout(timeoutHandle)

				if(callback) {
					callback(data)
				}
				else return data
			})
	}
}
