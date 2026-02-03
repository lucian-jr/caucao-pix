import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from "react-native"
import { colors, borders } from './constants'
import { styles } from './styles'

type ButtonProps = {
  label: string
  color?: keyof typeof colors
  border?: keyof typeof borders
  full?: boolean
  loading?: boolean
} & TouchableOpacityProps

const Button = ({
  full = false,
  label,
  color = 'blue',
  border = 'none',
  loading,
  ...props
}: ButtonProps) => (
  <TouchableOpacity
    activeOpacity={.75}
    style={[
      styles.container,
      colors[color].container,
      borders[border].container,
      props.disabled && { opacity: .6 }
    ]}
    {...props}
  > 
    {loading
      ? <ActivityIndicator color={colors[color].text.color} />
      : <Text style={[styles.text, colors[color].text]}>{label}</Text>}
  </TouchableOpacity>
)

export { Button }