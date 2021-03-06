import React from 'react'
import styled from 'styled-components'
import { Spring, Trail, animated } from 'react-spring'
import { theme } from '@aragon/ui'
import springs from '../../springs'

const ANIM_DELAY = 600

class VotesCast extends React.Component {
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
  render() {
    const { survey } = this.props
    const { animate } = this.state
    return (
      <Main>
        <h1>Votes cast so far</h1>
        <ul>
          <Trail
            from={{ progress: 0 }}
            to={{ progress: Number(animate) }}
            keys={survey.options.map(o => o.id)}
            config={springs.stiff}
            native
          >
            {survey.options.map(
              ({ id, label, color, totalVotes }) => ({ progress }) => (
                <animated.li
                  key={id}
                  style={{
                    opacity: progress,
                    transform: progress.interpolate(
                      t => `translateX(${20 * (1 - t)}%)`
                    ),
                  }}
                >
                  <span>
                    <Disc style={{ background: color }} />
                    {label}
                  </span>
                  <strong>{Math.floor(totalVotes)}</strong>
                </animated.li>
              )
            )}
          </Trail>
        </ul>
      </Main>
    )
  }
}

const Main = styled.section`
  h1 {
    margin-bottom: 15px;
    font-size: 16px;
  }
  li {
    list-style: none;
    display: flex;
    margin-bottom: 10px;
    justify-content: space-between;
    color: ${theme.textSecondary};
    strong {
      color: ${theme.textPrimary};
    }
  }
`

const Disc = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 15px;
  border-radius: 50%;
`

export default VotesCast
