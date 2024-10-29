import { on, once, emit, EventHandler } from '@create-figma-plugin/utilities'

import { useState, useEffect } from 'preact/hooks'

import { OnceHandler, rejectCheck, rejectSymbol, syncEmit } from '../interface'

import { UserDuplex } from '../types'
import { generateRandomText2 } from '../../utils/textTools'

export type FigmaUser = {
	uuid: string
	name: string
}

/**
 * User Data 전송
 */
export interface UserHandler extends EventHandler {
	name: 'User'
	handler: (user: FigmaUser) => void
}
/**
 * 요청 보내는 코드
 * 받는 코드는 위에서 처리할 수 있게 구성
 */
export interface getUserHandler extends EventHandler {
	name: 'getUser'
	handler: (key: string) => void
}

// 어뎁터는 한 번 또는 n번 선언
// 이벤트 리스너에 이벤트가 등록되는 개념이고 메세지가 오면 키 기반으로 payload 랑 함수를 실행하는 개념
// 양방향인데 선언하는 함수가 컴파일 시점에 전송대상이 정해지는 건지가 불분명함

/**
 * 데이터 실제 저장 객체에 저장되는 로직
 * 리엑트의 경우.. 사용해봐야 알 것 같음
 * 키 발행 로직이 따로 필요할 수 있음
 */
export const model = (value: string) => {
	figma.root.setPluginData('main', value)
}

/**
 * 데이터 쓰기 로직 ( 읽기 쓰기, 선택 등 )
 */
export const repository = (obj: Object) => {
	const value = JSON.stringify(obj)
	model(value)
}

/**
 * 구현해야되는 비즈니스 로직
 * 서비스는 서비스를 사용할 수 있음?
 */
export const service = () => {
	const data = {
		hello: 'world',
		count: 123,
	}
	repository(data)
}

const a = async () => {
	const dataTest = await syncEmit<UserDuplex>('User')
	if (rejectCheck(dataTest)) {
		console.log(dataTest)
	}
}

export const getUserSample = () =>
	new Promise((resolve, reject) => {
		const key = generateRandomText2()
		emit<getUserHandler>('getUser', key)
		const event = once<OnceHandler<[FigmaUser]>>(key, (...args) => {
			resolve(...args)
		})
		setTimeout(() => {
			event()
			reject(rejectSymbol)
		}, 1000)
	})

// rejectCheck()

export const useUser_Adapter = () => {
	const [user, setUser] = useState<FigmaUser>()

	useEffect(() => {
		// 항상 열려있는 인터페이스
		const event = on<UserHandler>('User', (user) => {
			setUser(user)
		})
		// 공식 루트
		// 받을 키로 전달해서 값을 받게 함
		emit<getUserHandler>('getUser', 'User')

		return () => {
			event()
		}
	}, [])
	return user
}

// test2
// on pipe ( readModel  , repository  , service ,  adapter )
// 실행 왼쪽으로 가서 마지막이 결과인 파이프
//  pipe ( 20 , setModel  , repository , service ,  adapter )
// 다음 파이프가 실행되는 값으로 함수를 보낼지 값을 보낼지를 번갈아가면서 핸들링해야한다는 점에서 난이도 높음
// 리턴이 거의 강제다보니 재사용성은 높음
// 데이터 저장으로 도달하는 중심이 중요한 것으로 판단되고
// 양방향 처리하는게 좋을 것 같음
