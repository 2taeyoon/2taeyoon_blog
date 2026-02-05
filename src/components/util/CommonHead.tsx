import React from "react";
import Head from "next/head";
import { MetaProps } from "@/types/props.types";

const CommonHead = ({ title, keywords, description, ogTitle, ogDescription,	ogURL, ogImage, ogType }: MetaProps) => (
  <Head>
    <title>{title}</title>
    <meta name="keywords" content={keywords}/>
    <meta name="description" content={description}/>
    <meta property="og:title" content={ogTitle}/>
    <meta property="og:description" content={ogDescription}/>
		<meta property="og:url" content={ogURL}/>
		<meta property="og:image" content={ogImage}/>
		<meta property="og:image:width" content="1200"/>
		<meta property="og:image:height" content="630"/>
		<meta property="og:type" content={ogType}/>
		<meta property="og:site_name" content="2taeyoon의 개인 블로그"/>
  </Head>
);

export default CommonHead;
