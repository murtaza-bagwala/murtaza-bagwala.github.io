// @flow strict
import React from 'react';
// import { graphql } from "gatsby";
// import type { MarkdownRemark } from "../types";

// type Props = {
// 	data: {
// 		markdownRemark: MarkdownRemark
// 	}
// };

import { Timeline } from 'react-twitter-widgets';

// Timeline (with options)

const Twitter = ({ data }: Props) => (
	<Timeline
		dataSource={{
		  sourceType: 'profile',
		  screenName: 'MurtazaBagwala1'
		}}
		options={{
		  height: '400'
		}}
	/>
);

// export const query = graphql`
// 	query {
// 		markdownRemark(frontmatter: { slug: { eq: "tweet" } }) {
// 			html
// 		}
// 	}
// `;

export default Twitter;
