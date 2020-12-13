// @flow strict
import React from "react";
import Author from "./Author";
import Contacts from "./Contacts";
import Copyright from "./Copyright";
import Menu from "./Menu";
import Twitter from "./Twitter";
import styles from "./Sidebar.module.scss";
import { useSiteMetadata, useCategoriesList } from "../../hooks";
import CategoryList from "./PostCategories";

type Props = {
	isIndex?: boolean
};

const Sidebar = ({ isIndex }: Props) => {
	const { author, copyright, menu } = useSiteMetadata();
	const categories = useCategoriesList();
	console.log(categories)

	return (
		<div className={styles["sidebar"]}>
			<div className={styles["sidebar__inner"]}>
				<Author author={author} isIndex={isIndex} />
				<Menu menu={menu} />
				<CategoryList categories={categories} />
				<Twitter></Twitter>
				<Contacts contacts={author.contacts} />
				<Copyright copyright={copyright} />
			</div>
		</div>
	);
};

export default Sidebar;
