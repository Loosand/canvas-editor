import { fabric } from "fabric"
import { useCallback, useEffect } from "react"

/**
 * UseAutoResizeProps 接口定义
 * @typedef {Object} UseAutoResizeProps
 * @property {fabric.Canvas | null} canvas - Fabric.js 画布对象
 * @property {HTMLDivElement | null} container - 包含画布的 HTML 容器
 */
interface UseAutoResizeProps {
	canvas: fabric.Canvas | null
	container: HTMLDivElement | null
}

/**
 * 自定义 Hook，用于自动调整画布大小
 * @param {UseAutoResizeProps} props - 包含画布和容器的属性
 */
export const useAutoResize = ({ canvas, container }: UseAutoResizeProps) => {
	/**
	 * 自动调整画布大小和缩放
	 * @function
	 */
	const autoZoom = useCallback(() => {
		if (!canvas || !container) return

		// 获取容器的宽度和高度
		const width = container.offsetWidth
		const height = container.offsetHeight

		// 设置画布的宽度和高度
		canvas.setWidth(width)
		canvas.setHeight(height)

		// 获取画布的中心点
		const center = canvas.getCenter()
		const zoomRatio = 0.95

		// 查找名为 "clip" 的工作区对象
		const localWorkspace = canvas
			.getObjects()
			.find((object) => object.name === "clip")

		// 计算适合容器的缩放比例
		// @ts-ignore
		const scale = fabric.util.findScaleToFit(localWorkspace, {
			width,
			height,
		})

		// 计算缩放比例并应用到画布
		const zoom = zoomRatio * scale
		canvas.setViewportTransform(fabric.iMatrix.concat())
		canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom)

		if (!localWorkspace) return

		// 获取工作区的中心点
		const workspaceCenter = localWorkspace.getCenterPoint()
		const viewportTransform = canvas.viewportTransform

		if (
			canvas.width === undefined ||
			canvas.height === undefined ||
			!viewportTransform
		) {
			return
		}

		// 调整视口变换，使工作区居中
		viewportTransform[4] =
			canvas.width / 2 - workspaceCenter.x * viewportTransform[0]
		viewportTransform[5] =
			canvas.height / 2 - workspaceCenter.y * viewportTransform[3]

		canvas.setViewportTransform(viewportTransform)

		// 克隆工作区对象并设置为画布的剪切路径
		localWorkspace.clone((cloned: fabric.Rect) => {
			canvas.clipPath = cloned
			canvas.requestRenderAll()
		})
	}, [canvas, container])

	// 使用 useEffect 监听容器大小变化
	useEffect(() => {
		let resizeObserver: ResizeObserver | null = null

		if (canvas && container) {
			resizeObserver = new ResizeObserver(() => {
				autoZoom()
			})

			resizeObserver.observe(container)
		}

		return () => {
			if (resizeObserver) {
				resizeObserver.disconnect()
			}
		}
	}, [canvas, container, autoZoom])
}
