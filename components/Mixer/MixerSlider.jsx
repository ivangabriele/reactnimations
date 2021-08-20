import Slider from '@material-ui/core/Slider'
import PropTypes from 'prop-types'

const MixerSlider = ({ defaultValue, label, max, min, onChange, settingKey, step }) => {
  const getAriaValueText = value => `${label}: ${value}`

  return (
    <>
      <Slider
        aria-label="Opacity"
        defaultValue={defaultValue}
        getAriaValueText={getAriaValueText}
        max={max}
        min={min}
        onChange={(_, value) => onChange(settingKey, value)}
        orientation="vertical"
        step={step}
        valueLabelDisplay="auto"
      />

      <style jsx>{`
        /*div {
        color: white;
        display: flex;
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
      }*/
      `}</style>
    </>
  )
}

MixerSlider.propTypes = {
  defaultValue: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  settingKey: PropTypes.string.isRequired,
  step: PropTypes.number.isRequired,
}

export default MixerSlider
