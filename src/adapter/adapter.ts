import { on, EventHandler } from '@create-figma-plugin/utilities'

interface adapterSampleHandler extends EventHandler {
	name: 'SAMPLE'
	handler: (count: number) => void
}

// 어뎁터는 한 번 또는 n번 선언
// 이벤트 리스너에 이벤트가 등록되는 개념이고 메세지가 오면 키 기반으로 payload 랑 함수를 실행하는 개념
// 양방향인데 선언하는 함수가 컴파일 시점에 전송대상이 정해지는 건지가 불분명함
// 전송 주체 기준으로 figma <=> ui 가 능동적임

export type HandlerParameters<T extends EventHandler> = Parameters<T['handler']>
export type Handler<T extends EventHandler> = (...args: HandlerParameters<T>) => void

type parametersType = HandlerParameters<adapterSampleHandler>
type handlerType = Handler<adapterSampleHandler>

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
	// 단일 검색
	// return value
}

/**
 * 구현해야되는 비즈니스 로직
 * 서비스는 서비스를 사용할 수 있음?
 */
export const service: handlerType = (count) => {
	const data = {
		hello: 'world',
		count: count,
	}
	repository(data)
	// 내부 레포지토리에 종속적이고 재사용이 어려운 단점
	// 리턴이 있는 로직과 레포지토리를 구분하기 어려운 단점
}

/**
 * 저장하는 adapter main에는 adapter 만 넣어야 함
 * 실행 한 번에 리스너 등록 한 번
 */
export const adapter = () => {
	on<adapterSampleHandler>('SAMPLE', service)
}

// test2
// on pipe ( readModel  , repository  , service ,  adapter )
// 실행 왼쪽으로 가서 마지막이 결과인 파이프
//  pipe ( 20 , setModel  , repository , service ,  adapter )
// 다음 파이프가 실행되는 값으로 함수를 보낼지 값을 보낼지를 번갈아가면서 핸들링해야한다는 점에서 난이도 높음
// 리턴이 거의 강제다보니 재사용성은 높음
// 데이터 저장으로 도달하는 중심이 중요한 것으로 판단되고
// 양방향 처리하는게 좋을 것 같음
