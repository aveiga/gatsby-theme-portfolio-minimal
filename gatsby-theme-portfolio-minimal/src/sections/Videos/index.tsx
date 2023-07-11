import React from 'react';
import { Animation } from '../../components/Animation';
import { Section } from '../../components/Section';
import { Slider } from '../../components/Slider';
import { ArticleCard, ArticleCardSkeleton } from '../../components/ArticleCard';
import { useSiteMetadata } from '../../hooks/useSiteMetadata';
import { PageSection } from '../../types';
import * as classes from './style.module.css';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

interface VideoSectionProps extends PageSection {}

export function VideoSection(props: VideoSectionProps): React.ReactElement {
    const response = useStaticQuery(graphql`
        query VideoListingQuery {
            allYoutubeVideo {
                edges {
                    node {
                        id
                        title
                        description
                        videoId
                        publishedAt
                        privacyStatus
                        channelTitle
                        thumbnail {
                            url
                            width
                            height
                        }
                    }
                }
            }
        }
    `);
    const [articles, setArticles] = React.useState<ArticleCard[]>([]);
    async function collectArticlesFromSources(): Promise<ArticleCard[]> {
        const articleList: ArticleCard[] = [];

        const blogArticles = response.allYoutubeVideo.edges;
        if (blogArticles.length > 0) {
            blogArticles.forEach((video: any) => {
                articleList.push({
                    image: {
                        src: {
                            childImageSharp: {
                                gatsbyImageData: {
                                    layout: 'fixed',
                                    width: 260,
                                    height: 100,
                                    images: {
                                        //@ts-ignore
                                        src: video.node.thumbnail.url,
                                    },
                                },
                            },
                        },
                    },
                    category: video.node.title,
                    title: '',
                    publishedAt: new Date(video.node.publishedAt),
                    link: `https://www.youtube.com/watch?v=${video.node.videoId}`,
                    readingTime: '',
                });
            });
        }

        return articleList.slice().sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    }

    React.useEffect(() => {
        (async function () {
            setArticles(await collectArticlesFromSources());
        })();
    }, []);

    return (
        <Animation type="fadeUp" delay={1000}>
            <Section anchor={props.sectionId} heading={props.heading}>
                <Slider additionalClasses={[classes.Articles]}>
                    {articles.length > 0
                        ? articles.slice(0, 3).map((article, key) => {
                              return <ArticleCard key={key} data={article} showBanner={true} />;
                          })
                        : [...Array(3)].map((_, key) => {
                              return <ArticleCardSkeleton key={key} />;
                          })}
                </Slider>
            </Section>
        </Animation>
    );
}

// validateAndConfigureSources: Sources for articles can be defined as props (e.g. sources=["Medium"])
// Currently, only Medium can be used as a source but it is thinkable to extend this approach to other
// sources (e.g. an integrated Markdown blog). To collect all articles from the source, there is a
// specific configuration needed for each source type. For example, to collect articles from Medium,
// we need the profile URL. This function is responsible for validating that at least one source is
// defined. It than adds the needed configuration properties to each source and returns the config.
