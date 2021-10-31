import React, { useEffect } from 'react'
import { Pane, majorScale, Text } from 'evergreen-ui'
import { useSession, signIn } from 'next-auth/client'
import { useRouter } from 'next/router'
import Logo from '../components/logo'
import SocialButton from '../components/socialButton'

const objPaneTitleStyle = {
  height: '100%',
  width: '50%',
  borderRight: true,
  paddingX: majorScale(8),
  paddingY: majorScale(5),
  background: '#47B881',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const objPaneButtonsStyle = {
  height: '100%',
  width: '50%',
  background: 'tint2',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingX: majorScale(7),
}

/**
 * @description sign in page
 * @returns {JSX}
 */
const Signin = (): JSX.Element => {
  const router = useRouter()
  const [session, loading] = useSession()

  const handleSignIn = () => {
    signIn('github')
  }

  useEffect(() => {
    if (session) {
      router.push('/app')
    }
  }, [session, router])

  return (
    <Pane height="100vh" width="100vw" display="flex">
      <Pane {...objPaneTitleStyle}>
        <Pane>
          <Logo color="white" fontSize="60px" />
          <Pane marginTop={majorScale(2)}>
            <Text color="white" fontSize="22px">
              Sign in.
            </Text>
          </Pane>
        </Pane>
      </Pane>
      <Pane {...objPaneButtonsStyle}>
        <Pane width="100%" textAlign="center">
          <SocialButton type="github" onClick={handleSignIn} />
        </Pane>
      </Pane>
    </Pane>
  )
}

export default Signin
