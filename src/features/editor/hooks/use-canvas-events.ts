import { fabric } from "fabric"
import { useEffect } from "react"

/**
 * UseCanvasEvents 接口定义
 * @typedef {Object} UseCanvasEvents
 * @property {fabric.Canvas | null} canvas - Fabric.js 画布对象
 * @property {function(fabric.Object[]): void} setSelectedObjects - 设置选中对象的函数
 */
interface UseCanvasEvents {
	canvas: fabric.Canvas | null
	setSelectedObjects: (objects: fabric.Object[]) => void
}

/**
 * 自定义 Hook，用于处理画布的选择事件
 * @param {UseCanvasEvents} props - 包含画布和设置选中对象函数的属性
 */
export const useCanvasEvents = ({
	canvas,
	setSelectedObjects,
}: UseCanvasEvents) => {
	useEffect(() => {
		if (canvas) {
			canvas.on("selection:created", (e) => {
				setSelectedObjects(e.selected || [])
			})

			canvas.on("selection:updated", (e) => {
				setSelectedObjects(e.selected || [])
			})

			canvas.on("selection:cleared", () => {
				setSelectedObjects([])
			})
		}

		return () => {
			if (canvas) {
				canvas.off("selection:created")
				canvas.off("selection:updated")
				canvas.off("selection:cleared")
			}
		}
	}, [canvas, setSelectedObjects])
}
