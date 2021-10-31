import React, { FC, useState } from 'react'
import { Pane, Dialog, majorScale } from 'evergreen-ui'
import { GetServerSideProps } from 'next'
import { getSession, useSession } from 'next-auth/client'
import { Session } from 'next-auth'
import { useRouter } from 'next/router'
import Logo from '../../components/logo'
import FolderList from '../../components/folderList'
import NewFolderButton from '../../components/newFolderButton'
import User from '../../components/user'
import FolderPane from '../../components/folderPane'
import DocPane from '../../components/docPane'
import NewFolderDialog from '../../components/newFolderDialog'
import { folder, doc, connectToDB } from '../../db'
import { UserSession } from '../../types'

type Props = {
  folders?: Record<string, any>[]
  activeFolder?: Record<string, any>
  activeDoc?: Record<string, any>
  activeDocs?: Record<string, any>[]
}

const App: FC<Props> = ({ folders, activeDoc, activeFolder, activeDocs }) => {
  const router = useRouter()
  const [newFolderIsShown, setIsShown] = useState(false)
  const [session, loading] = useSession()
  if (loading) {
    return null
  }

  const Page = () => {
    if (activeDoc) {
      return <DocPane folder={activeFolder} doc={activeDoc} />
    }

    if (activeFolder) {
      return <FolderPane folder={activeFolder} docs={activeDocs} />
    }

    return null
  }

  if (!loading && !session) {
    return (
      <Dialog
        isShown
        title="Session expired"
        confirmLabel="Ok"
        hasCancel={false}
        hasClose={false}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEscapePress={false}
        onConfirm={() => router.push('/signin')}
      >
        Sign in to continue
      </Dialog>
    )
  }

  return (
    <Pane position="relative">
      <Pane width={300} position="absolute" top={0} left={0} background="tint2" height="100vh" borderRight>
        <Pane padding={majorScale(2)} display="flex" alignItems="center" justifyContent="space-between">
          <Logo />

          <NewFolderButton onClick={() => setIsShown(true)} />
        </Pane>
        <Pane>
          <FolderList folders={folders} />
        </Pane>
      </Pane>
      <Pane marginLeft={300} width="calc(100vw - 300px)" height="100vh" overflowY="auto" position="relative">
        {session.user && <User user={session.user as UserSession} />}
        <Page />
      </Pane>
      <NewFolderDialog close={() => setIsShown(false)} isShown={newFolderIsShown} onNewFolder={() => {}} />
    </Pane>
  )
}

App.defaultProps = {
  folders: [{ _id: '1', name: 'hello' }],
}

/**
 * @description Now that we have users and jwts, we can lock down access to our app at `./pages/app/[[...id]].tsx`. This is an optional catch all route which means its inclusive an also matches `/app`. A user should be signed in to access this route, lets make it so
 * if `/app/1` => context.params.id=[1] or context.params.id=1
 * if `/app/1/2` => context.params.id=[1, 2]
 */

/**
 * Catch all handler. Must handle all different page
 * states.
 * 1. Folders - none selected
 * 2. Folders => Folder selected
 * 3. Folders => Folder selected => Document selected
 *
 * An unauthorized user should not be able to access this page.
 *
 * @param context
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session: Session | Record<string, any> = await getSession(context)
  if (!session) {
    return {
      props: {
        session,
      },
    }
  }

  const { db } = await connectToDB()
  const folders = await folder.getFolders(db, session.user.id)
  const props: Record<string, any> = { session, folders }

  if (context.params.id) {
    // if so => means we are in state 2, folder is selected
    props.activeFolder = props.folders.find(({ _id }) => _id === context.params.id[0])

    props.activeDocs = await doc.getDocsByFolder(db, props.activeFolder._id)

    const activeDocId = context.params.id[1]
    if (activeDocId) {
      // if so => means we are in state 3, folder is selected and folder's doc is also selected
      props.activeDoc = props.activeDocs.find((objDoc) => objDoc._id === activeDocId)
    }
  }

  return {
    props,
  }
}

export default App
