// @flow strict
import React from "react";
import { Link } from "gatsby";
import kebabCase from "lodash/kebabCase";
import styles from "./Category.module.scss";

const Categories = ({ categories }) => {
	return (
		<nav className={styles["cate"]}>
			<b>Post Categories</b> <br />
			{categories.map(category => (
				<span className={styles["cate__item-meta-category"]}>
					<Link
						to={`/category/${kebabCase(category.fieldValue)}/`}
						className={styles["cate__item-meta-category-link"]}
					>
						{category.fieldValue} ({category.totalCount}){" "}
					</Link>
				</span>
			))}
		</nav>
	);
};

export default Categories;
