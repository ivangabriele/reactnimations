import PropTypes from 'prop-types'

import MixerSlider from './MixerSlider'

const Mixer = ({ onChange, settings }) => (
  <>
    <div>
      {settings.map(([label, settingKey, [min, max, defaultValue, step]]) => (
        <MixerSlider
          key={label}
          defaultValue={defaultValue}
          label={label}
          max={max}
          min={min}
          onChange={onChange}
          settingKey={settingKey}
          step={step}
        />
      ))}
    </div>

    <style jsx>{`
      div {
        bottom: 2rem;
        color: white;
        display: flex;
        height: 20%;
        opacity: 0.5;
        position: absolute;
        right: 1.5rem;
        width: auto;
      }
      div:hover {
        opacity: 1;
      }
    `}</style>
  </>
)

Mixer.propTypes = {
  onChange: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  settings: PropTypes.array.isRequired,
}

export default Mixer
