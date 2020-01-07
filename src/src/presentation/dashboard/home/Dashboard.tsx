import React, { Fragment } from "react";
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

import NavigationHeaderStyle from "../../common/NavigationHeaderStyle";
import commonStyles from "../../resources/commonStyles";
import { DidiText } from "../../util/DidiText";
import DropdownMenu from "../../util/DropdownMenu";
import NavigationEnabledComponent from "../../util/NavigationEnabledComponent";
import { DocumentCredentialCard, sampleDocumentToCard } from "../common/documentToCard";

import { CredentialDocument } from "../../../model/CredentialDocument";
import { RecentActivity } from "../../../model/RecentActivity";
import { SampleDocument } from "../../../model/SampleDocument";
import { recoverTokens } from "../../../services/trustGraph/recoverTokens";
import { checkValidateDni } from "../../../services/user/checkValidateDni";
import { ValidatedIdentity } from "../../../store/selector/combinedIdentitySelector";
import { SpecialCredentialMap } from "../../../store/selector/credentialSelector";
import { didiConnect } from "../../../store/store";
import { StartAccessProps } from "../../access/StartAccess";
import colors from "../../resources/colors";
import strings from "../../resources/strings";
import themes from "../../resources/themes";
import { DocumentDetailProps } from "../documents/DocumentDetail";
import { DocumentsScreenProps } from "../documents/DocumentsScreen";
import { UserDataProps } from "../settings/userData/UserData";
import { ValidateIdentityExplainWhatProps } from "../validateIdentity/ValidateIdentityExplainWhat";
import { ValidateIdentityFailureProps } from "../validateIdentity/ValidateIdentityFailure";
import { ValidateIdentitySuccessProps } from "../validateIdentity/ValidateIdentitySuccess";

import DidiActivity from "./DidiActivity";
import { EvolutionCard } from "./EvolutionCard";
import HomeHeader from "./HomeHeader";
import { IncompleteIdentityCard } from "./IncompleteIdentityCard";
import { NotificationScreenProps } from "./NotificationScreen";

export type DashboardScreenProps = {};
interface DashboardScreenStateProps {
	person: ValidatedIdentity;
	credentials: CredentialDocument[];
	samples: SampleDocument[];
	recentActivity: RecentActivity[];
	activeSpecialCredentials: SpecialCredentialMap;
}
interface DashboardScreenDispatchProps {
	login(): void;
	resetDniValidation: () => void;
}
type DashboardScreenInternalProps = DashboardScreenProps & DashboardScreenStateProps & DashboardScreenDispatchProps;

export interface DashboardScreenNavigation {
	Access: StartAccessProps;
	DashboardDocuments: DocumentsScreenProps;
	ValidateID: ValidateIdentityExplainWhatProps;
	ValidateIDSuccess: ValidateIdentitySuccessProps;
	ValidateIDFailure: ValidateIdentityFailureProps;
	UserData: UserDataProps;
	NotificationScreen: NotificationScreenProps;
	DashDocumentDetail: DocumentDetailProps;
}

class DashboardScreen extends NavigationEnabledComponent<DashboardScreenInternalProps, {}, DashboardScreenNavigation> {
	static navigationOptions = NavigationHeaderStyle.gone;

	componentDidMount() {
		this.props.login();
	}

	private renderRegularDocuments() {
		return this.props.credentials.map((document, index) => (
			<TouchableOpacity
				key={`RG_${index}`}
				onPress={() =>
					this.navigate("DashDocumentDetail", {
						document,
						activeSpecialCredentials: this.props.activeSpecialCredentials
					})
				}
			>
				<DocumentCredentialCard preview={true} document={document} context={this.props.activeSpecialCredentials} />
			</TouchableOpacity>
		));
	}

	private renderRecentActivities() {
		return (
			<View style={styles.dropdownContents}>
				{this.props.recentActivity.map((activity, index) => {
					return <DidiActivity key={index} activity={activity} style={styles.activities} />;
				})}
				<View>
					<TouchableOpacity onPress={() => {}}>
						<DidiText.Explanation.Emphasis style={styles.loadMoreText}>
							{strings.dashboard.recentActivities.loadMore + " +"}
						</DidiText.Explanation.Emphasis>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	render() {
		return (
			<Fragment>
				<StatusBar backgroundColor={themes.darkNavigation} barStyle="light-content" />
				<SafeAreaView style={[commonStyles.view.area, { backgroundColor: themes.navigation }]}>
					<ScrollView style={styles.body}>
						<HomeHeader
							person={this.props.person}
							onPersonPress={() => this.navigate("UserData", {})}
							onBellPress={() => this.navigate("NotificationScreen", {})}
						/>
						<View style={{ paddingHorizontal: 20, paddingVertical: 8 }}>
							<EvolutionCard credentials={this.props.credentials} />
							{this.renderRegularDocuments()}
							{this.props.samples.map(sampleDocumentToCard)}
							<IncompleteIdentityCard
								personName={this.props.person.visual.name || this.props.person.visual.id || ""}
								onStartValidateId={() => this.navigate("ValidateID", {})}
								onValidateIdSuccess={() => {
									this.props.resetDniValidation();
									this.navigate("ValidateIDSuccess", {});
								}}
								onValidateIdFailure={(message?: string) => {
									this.props.resetDniValidation();
									this.navigate("ValidateIDFailure", { message });
								}}
							/>
						</View>
						<DropdownMenu style={styles.dropdown} label={strings.dashboard.recentActivities.label}>
							{this.renderRecentActivities()}
						</DropdownMenu>
					</ScrollView>
				</SafeAreaView>
			</Fragment>
		);
	}
}

export default didiConnect(
	DashboardScreen,
	(state): DashboardScreenStateProps => ({
		person: state.identity,
		recentActivity: state.recentActivity,
		credentials: state.credentials,
		samples: state.samples,
		activeSpecialCredentials: state.activeSpecialCredentials
	}),
	(dispatch): DashboardScreenDispatchProps => ({
		login: () => {
			dispatch({ type: "SESSION_LOGIN" });
			dispatch(recoverTokens());
			dispatch(checkValidateDni());
		},
		resetDniValidation: () => dispatch({ type: "VALIDATE_DNI_RESET" })
	})
);

const styles = StyleSheet.create({
	body: {
		backgroundColor: colors.background,
		width: "100%"
	},
	menu: {
		marginBottom: 10
	},
	loadMoreText: {
		fontSize: 14,
		marginVertical: 16
	},
	dropdown: {
		backgroundColor: colors.darkBackground,
		width: "100%"
	},
	dropdownContents: {
		marginTop: 0
	},
	activities: {
		backgroundColor: "#FFF",
		marginBottom: 2
	}
});
