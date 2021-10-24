import React, { FC } from 'react'
import { GetStaticPaths, GetStaticProps, GetServerSidePropsContext } from 'next'
import path from 'path'
import fs from 'fs'
import hydrate from 'next-mdx-remote/hydrate'
import renderToString from 'next-mdx-remote/render-to-string'
import matter from 'gray-matter'
import { majorScale, Pane, Heading, Spinner } from 'evergreen-ui'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Post } from '../../types'
import Container from '../../components/container'
import HomeNav from '../../components/homeNav'
import { posts as postsFromCMS } from '../../content'

const BlogPost: FC<Post> = ({ source, frontMatter }) => {
  const content = hydrate(source)
  const router = useRouter()

  if (router.isFallback) {
    return (
      <Pane width="100%" height="100%">
        <Spinner size={48} />
      </Pane>
    )
  }
  return (
    <Pane>
      <Head>
        <title>{`Known Blog | ${frontMatter.title}`}</title>
        <meta name="description" content={frontMatter.summary} />
      </Head>
      <header>
        <HomeNav />
      </header>
      <main>
        <Container>
          <Heading fontSize="clamp(2rem, 8vw, 6rem)" lineHeight="clamp(2rem, 8vw, 6rem)" marginY={majorScale(3)}>
            {frontMatter.title}
          </Heading>
          <Pane>{content}</Pane>
        </Container>
      </main>
    </Pane>
  )
}

BlogPost.defaultProps = {
  source: '',
  frontMatter: { title: 'default title', summary: 'summary', publishedOn: '' },
}

/**
 * @description Any static side generaton and if you have a dynamic routes - you need to provide all those routes list to generate at build time.
 * So, we need to get the paths here then the the correct post for the matching path Posts can come from the fs or our CMS
 */
export const getStaticPaths: GetStaticPaths = async (context) => {
  // read all file names in directory: `posts/`
  const pathToPosts = path.join(process.cwd(), 'posts')
  const fileNames = fs.readdirSync(pathToPosts)

  const slugs: Record<string, any>[] = fileNames.map((file) => {
    const fullPath = path.join(pathToPosts, file)
    const content = fs.readFileSync(fullPath, 'utf-8')
    const { data } = matter(content)
    return data
  })

  /**
   * @description `fallback: true` - will allow us to still attampt to render the page that wasn't previouly rendered at build time, ig `getStaticProps` doesn't error out.
   */
  return {
    paths: slugs.map((s) => ({ params: { slug: s.slug } })),
    fallback: true,
  }
}

type CtxType = GetServerSidePropsContext<{ slug: string }>

/*
 * @description `getStaticProps` - gets us the data that matches these paths at the runtime, however the paths themselves were provided by `getStaticPaths` at build time;
 * @param {Object} context context object
 * @returns {Object} component static props
 */
export const getStaticProps: GetStaticProps = async (context: CtxType) => {
  const { params } = context
  let post: string

  try {
    // 1st: we try to find the content data in the file system
    const pathToFile = path.join(process.cwd(), 'posts', `${params.slug}.mdx`)
    post = fs.readFileSync(pathToFile, 'utf-8')
  } catch (error) {
    // 2nd: if there is no content in file system, then we get the content from imported file ( as a backup ). in rael scenario it will be probably an error handling.
    const cmsPosts = postsFromCMS.published.map((post) => matter(post))
    const match = cmsPosts.find((p) => p.data.slug === params.slug)
    post = match.content
  }
  const { data } = matter(post)
  const mdxSource = await renderToString(post, { scope: data })

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
    },
  }
}
export default BlogPost
