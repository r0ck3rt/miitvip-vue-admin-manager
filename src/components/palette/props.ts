import { tuple, placement, actions } from './../_utils/props'
import { PropTypes } from '../../utils/types'

export interface PaletteProperties {
    trigger: string
    placement: string
}
export const PaletteProps = () => ({
    trigger: PropTypes.oneOf(tuple(...actions)).def('click'),
    placement: PropTypes.oneOf(tuple(...placement)).def('bottom')
})
