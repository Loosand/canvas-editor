import { ChromePicker, CirclePicker } from "react-color"
import { colors } from "../types"
import { rgbaObjectToString } from "../utils"

/**
 * ColorPicker 组件的属性接口
 * @typedef {Object} ColorPickerProps
 * @property {string} value - 当前选中的颜色值
 * @property {function(string): void} onChange - 当颜色变化时的回调函数
 */
interface ColorPickerProps {
	value: string
	onChange: (value: string) => void
}

/**
 * ColorPicker 组件
 * @param {ColorPickerProps} props - 组件属性
 * @returns {JSX.Element} ColorPicker 组件
 */
export function ColorPicker({
	value,
	onChange,
}: ColorPickerProps): JSX.Element {
	return (
		<div className="w-full space-y-4">
			<ChromePicker
				color={value}
				onChange={(color) => {
					const formattedValue = rgbaObjectToString(color.rgb)
					onChange(formattedValue)
				}}
				className="border rounded-lg"
			/>

			<CirclePicker
				color={value}
				colors={colors}
				onChangeComplete={(color) => {
					const formattedValue = rgbaObjectToString(color.rgb)
					onChange(formattedValue)
				}}
			/>
		</div>
	)
}
