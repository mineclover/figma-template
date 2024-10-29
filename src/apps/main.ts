import { once, showUI } from '@create-figma-plugin/utilities'
import { adapterSampleHandler, CloseHandler } from '../adapter/types'

export default function () {
	once<adapterSampleHandler>('SAMPLE', function (count: number) {
		const nodes: Array<SceneNode> = []
		for (let i = 0; i < count; i++) {
			const rect = figma.createRectangle()
			rect.x = i * 150
			rect.fills = [
				{
					color: { b: 0, g: 0.5, r: 1 },
					type: 'SOLID',
				},
			]
			figma.currentPage.appendChild(rect)
			nodes.push(rect)
		}
		figma.currentPage.selection = nodes
		figma.viewport.scrollAndZoomIntoView(nodes)
		figma.closePlugin()
	})
	once<CloseHandler>('CLOSE', function () {
		figma.closePlugin()
	})
	showUI({
		height: 137,
		width: 240,
	})
}
