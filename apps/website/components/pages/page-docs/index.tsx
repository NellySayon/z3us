import React from 'react'
import { MdxTheme } from 'components/mdx-theme'
import { LazyMotion } from 'components/lazy-motion'
import { Header } from 'components/header'
import { ButtonCVA } from 'components/button-cva'
import { Footer } from 'components/footer'
import { PageContainer } from 'components/page-container'
import { SideMenu } from 'components/side-menu'
import { DocsPageProps } from 'types'

export const PageDocs: React.FC<DocsPageProps> = ({ docs, mdxSource }) => (
	<LazyMotion>
		<div className="docs flex flex-col">
			<Header isStickyHeader className="transition-colors fill-black dark:fill-white" />
			<PageContainer className="flex-1">
				<div className="docs-wrapper">
					<SideMenu docs={docs} />
					<div className="docs-content">
						<MdxTheme mdxSource={mdxSource} />
					</div>
					<div className="docs-on-page">
						<div>
							<ButtonCVA intent="secondary" size="small" className="geebs">
								Button CVA
							</ButtonCVA>
							<p>On this page</p>
							<ul>
								<li>
									<a href="#quickstart">Quickstart</a>
								</li>
								<li>
									<a href="#full-tutorial">Full tutorial</a>
								</li>
								<li>
									<a href="#1-running-create-turbo">1. Running create-turbo</a>
								</li>
								<li>
									<a href="#where-would-you-like-to-create-your-turborepo">
										Where would you like to create your turborepo?
									</a>
								</li>
								<li>
									<a href="#which-package-manager-do-you-want-to-use">Which package manager do you want to use?</a>
								</li>
								<li>
									<a href="#installation">Installation</a>
								</li>
								<li>
									<a href="#2-exploring-your-new-repo">2. Exploring your new repo</a>
								</li>
								<li>
									<a href="#understanding-packagesui">Understanding packages/ui</a>
								</li>
								<li>
									<a href="#understanding-imports-and-exports">Understanding imports and exports</a>
								</li>
								<li>
									<a href="#understanding-tsconfig">Understanding tsconfig</a>
								</li>
								<li>
									<a href="#understanding-eslint-config-custom">Understanding eslint-config-custom</a>
								</li>
								<li>
									<a href="#summary">Summary</a>
								</li>
								<li>
									<a href="#3-understanding-turbojson">3. Understanding turbo.json</a>
								</li>
								<li>
									<a href="#4-linting-with-turborepo">4. Linting with Turborepo</a>
								</li>
								<li>
									<a href="#using-the-cache">Using the cache</a>
								</li>
								<li>
									<a href="#5-building-with-turborepo">5. Building with Turborepo</a>
								</li>
								<li>
									<a href="#6-running-dev-scripts">6. Running dev scripts</a>
								</li>
								<li>
									<a href="#running-dev-on-only-one-workspace-at-a-time">Running dev on only one workspace at a time</a>
								</li>
								<li>
									<a href="#summary-1">Summary</a>
								</li>
								<li>
									<a href="#next-steps">Next steps</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</PageContainer>
			<Footer className="pt-2 pb-4 sm:pb-8 sm:pt-8" />
		</div>
	</LazyMotion>
)
