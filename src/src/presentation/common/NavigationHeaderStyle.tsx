import React from "react";
import {
	HeaderBackButton,
	NavigationParams,
	NavigationScreenProp,
	NavigationStackScreenOptions,
	NavigationState
} from "react-navigation";
import { HeaderButton, HeaderButtonProps, HeaderButtons, Item } from "react-navigation-header-buttons";
import { defaultOnOverflowMenuPress } from "react-navigation-header-buttons/src/overflowMenuPressHandlers";

import { fontsToUse } from "../util/DidiText";

import DidiTheme from "../resources/DidiTheme";
import VerticalMore from "../resources/images/verticalMore.svg";
import themes from "../resources/themes";

function defaultStyle(theme: DidiTheme): NavigationStackScreenOptions {
	return {
		headerStyle: {
			backgroundColor: theme.navigation
		},
		headerTintColor: theme.navigationText,
		headerTitleStyle: {
			fontFamily: fontsToUse.navigationHeader
		}
	};
}

const goneStyle: NavigationStackScreenOptions = {
	header: null
};

type NavigationFunction = (args: {
	props: any;
	navigation: any;
	screenProps: any;
	navigationOptions: NavigationStackScreenOptions;
}) => NavigationStackScreenOptions;

export type NavigationOptions = NavigationFunction | NavigationStackScreenOptions;

const MaterialHeaderButton = (props: HeaderButtonProps) => (
	<HeaderButton {...props} iconSize={23} color={themes.navigationIconActive} />
);

const styles = {
	withTitle(title: string): NavigationStackScreenOptions {
		return { ...defaultStyle(themes.primaryTheme), title };
	},

	withTitleAndRightButtonActions<Nav>(
		title: string,
		actions: Array<{
			actionTitle: string;
			onPress: (
				navigation: Omit<NavigationScreenProp<NavigationState, NavigationParams>, "navigate"> & {
					navigate<Target extends Extract<keyof Nav, string>>(target: Target, props: Nav[Target]): void;
				}
			) => void;
		}>
	): NavigationOptions {
		return ({ navigation }) => {
			return {
				...defaultStyle(themes.primaryTheme),
				title,
				headerRight: (
					<HeaderButtons
						HeaderButtonComponent={MaterialHeaderButton}
						OverflowIcon={<VerticalMore width={44} height={16} />}
						onOverflowMenuPress={({ overflowButtonRef, hiddenButtons }) =>
							defaultOnOverflowMenuPress({
								overflowButtonRef,
								hiddenButtons,
								cancelButtonLabel: "Cancel"
							})
						}
					>
						{actions.map(({ actionTitle, onPress }, index) => {
							return <Item key={index} title={actionTitle} onPress={() => onPress(navigation)} show="never" />;
						})}
					</HeaderButtons>
				)
			};
		};
	},

	withTitleAndFakeBackButton<Navigation, K extends keyof Navigation>(
		title: string,
		target: K,
		props: Navigation[K]
	): NavigationOptions {
		return ({ navigation }) => {
			return {
				...defaultStyle(themes.primaryTheme),
				title,
				headerLeft: (
					<HeaderBackButton tintColor={themes.navigationText} onPress={() => navigation.navigate(target, props)} />
				)
			};
		};
	},

	gone: goneStyle
};

export default styles;
