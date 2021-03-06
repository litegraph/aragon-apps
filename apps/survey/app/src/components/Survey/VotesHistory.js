import React from 'react'
import styled from 'styled-components'
import { Trail, Spring } from 'react-spring'
import springs from '../../springs'

const WIDTH = 300
const HEIGHT = 200
const CAPTIONS_HEIGHT = 20
const DURATION_SLICES = 16
const DOT_RADIUS = 7 / 2

const ANIM_DELAY = 500

const BORDER_COLOR = 'rgba(209, 209, 209, 0.5)'

class VotesHistory extends React.Component {
  state = {
    animate: false,
  }
  componentDidMount() {
    // animate after a delay
    this._transitionTimer = setTimeout(() => {
      this.setState({ animate: true })
    }, ANIM_DELAY)
  }
  componentWillUnmount() {
    clearTimeout(this._transitionTimer)
  }
  getX(voteIndex) {
    const slice = WIDTH / (DURATION_SLICES - 1)
    return slice * voteIndex
  }
  getY(votePercentage, progress) {
    return HEIGHT - HEIGHT * votePercentage * progress
  }
  render() {
    const { survey } = this.props
    const history = survey.history.slice(0, DURATION_SLICES)
    const filteredOptions = survey.options.map((option, i) => ({
      ...option,
      history: history.map(points => points[i]),
    }))
    const { animate } = this.state
    return (
      <Main>
        <h1>Votes</h1>

        <SvgWrapper>
          <Spring
            from={{ progress: 0 }}
            to={{ progress: Number(animate) }}
            config={springs.slow}
          >
            {({ progress }) => (
              <svg viewBox={`0 0 ${WIDTH} ${HEIGHT + CAPTIONS_HEIGHT}`}>
                <rect
                  width={WIDTH}
                  height={HEIGHT}
                  rx="3"
                  ry="3"
                  fill="#ffffff"
                  strokeWidth="1"
                  stroke={BORDER_COLOR}
                />
                {filteredOptions.map(({ history, color }) => (
                  <g key={color}>
                    <path
                      d={`
                        M${this.getX(0)},${this.getY(history[0], progress)}
                        ${history
                          .slice(1)
                          .map(
                            (val, i) =>
                              `L
                                ${this.getX((i + 1) * progress)},
                                ${this.getY(val, progress)}
                              `
                          )
                          .join('')}
                      `}
                      fill="transparent"
                      stroke={color}
                      strokeWidth="2"
                      strokeOpacity="0.7"
                    />
                    {history
                      .slice(1, -1)
                      .map((val, i) => (
                        <circle
                          key={i}
                          cx={this.getX(i + 1) * progress}
                          cy={this.getY(val, progress)}
                          r={DOT_RADIUS}
                          fill="white"
                          stroke={color}
                          strokeWidth="1"
                        />
                      ))}
                  </g>
                ))}
                <line
                  x1={this.getX(history.length - 1) * progress}
                  y1="0"
                  x2={this.getX(history.length - 1) * progress}
                  y2={HEIGHT}
                  stroke="#DAEAEF"
                  strokeWidth="3"
                />
                <path
                  d={`
                    M 0,${HEIGHT}
                    ${[...new Array(DURATION_SLICES)].reduce(
                      (path = '', _, i) =>
                        `${path} M ${this.getX(i)},${HEIGHT} l 0,-8`
                    )}
                  `}
                  stroke={BORDER_COLOR}
                  strokeWidth="1"
                />
                <g transform={`translate(0,${HEIGHT + CAPTIONS_HEIGHT * 0.7})`}>
                  {[...new Array(DURATION_SLICES - 1)].map((_, i) => (
                    <text
                      key={i}
                      x={this.getX(i) + (i === 0 ? 2 : 0)}
                    >
                      {i + 1}.
                    </text>
                  ))}
                </g>
              </svg>
            )}
          </Spring>
        </SvgWrapper>
      </Main>
    )
  }
}

const Main = styled.section`
  h1 {
    margin-bottom: 15px;
    font-size: 16px;
  }
`

const SvgWrapper = styled.div`
  svg {
    display: block;
    text {
      font-size: 12px;
      font-weight: 300;
      fill: #6d777b;
    }
  }
`

export default VotesHistory
