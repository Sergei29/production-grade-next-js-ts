import React, { FC } from 'react'
import { GetStaticProps } from 'next'
import { Pane, majorScale } from 'evergreen-ui'
import matter from 'gray-matter'
import path from 'path'
import fs from 'fs'
import orderby from 'lodash.orderby'
import Container from '../../components/container'
import HomeNav from '../../components/homeNav'
import PostPreview from '../../components/postPreview'
import { posts as postsFromCMS } from '../../content'

type Props = {
  posts: {
    title: string
    summary: string
    slug: string
  }[]
}

const Blog: FC<Props> = ({ posts }) => {
  return (
    <Pane>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          {posts.map((post) => (
            <Pane key={post.title} marginY={majorScale(5)}>
              <PostPreview post={post} />
            </Pane>
          ))}
        </Container>
      </main>
    </Pane>
  )
}

Blog.defaultProps = {
  posts: [],
}

export default Blog

/**
 * Need to get the posts from the
 * fs and our CMS
 */
export const getStaticProps: GetStaticProps = async (context) => {
  const cmsPosts = (context.preview ? postsFromCMS.draft : postsFromCMS.published).map((strContent) => {
    const { data } = matter(strContent)
    return data
  })

  // read all file names in directory: `posts/`
  const pathToPosts = path.join(process.cwd(), 'posts')
  const fileNames = fs.readdirSync(pathToPosts)

  // read all content within the `posts/*.mdx` files
  const filePosts = fileNames.map((file) => {
    const fullPath = path.join(pathToPosts, file)
    const content = fs.readFileSync(fullPath, 'utf-8')
    const { data } = matter(content)
    return data
  })

  const allPosts = [...cmsPosts, ...filePosts]

  return {
    props: {
      posts: allPosts,
    },
  }
}
