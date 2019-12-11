import React from "react";
import { TakePictureResponse } from "react-native-camera/types";

import NavigationHeaderStyle from "../../common/NavigationHeaderStyle";
import NavigationEnabledComponent from "../../util/NavigationEnabledComponent";
import { BarcodeType } from "../common/DidiCamera";

import { DocumentBarcodeData, fromPDF417 } from "../../../model/DocumentBarcodeData";
import strings from "../../resources/strings";

import { ValidateIdentityBackProps } from "./ValidateIdentityBack";
import ValidateIdentityExplanation from "./ValidateIdentityExplanation";
import { ValidateIdentityTakePhoto } from "./ValidateIdentityTakePhoto";

export interface ValidateIdentityFrontNavigation {
	ValidateIdentityBack: ValidateIdentityBackProps;
}
export interface ValidateIdentityFrontProps {}

interface ValidateIdentityFrontState {
	documentData?: DocumentBarcodeData;
}

export class ValidateIdentityFrontScreen extends NavigationEnabledComponent<
	ValidateIdentityFrontProps,
	ValidateIdentityFrontState,
	ValidateIdentityFrontNavigation
> {
	static navigationOptions = NavigationHeaderStyle.withTitle(strings.validateIdentity.header);

	constructor(props: ValidateIdentityFrontProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<ValidateIdentityTakePhoto
				photoWidth={1800}
				photoHeight={1200}
				targetWidth={1500}
				targetHeight={1000}
				cameraLandscape={true}
				cameraButtonDisabled={this.state.documentData === undefined}
				onPictureTaken={data =>
					this.navigate("ValidateIdentityBack", {
						documentData: this.state.documentData!,
						front: data
					})
				}
				onBarcodeScanned={(data, type) => this.onBarcodeScanned(data, type)}
				explanation={startCamera => (
					<ValidateIdentityExplanation
						title={strings.validateIdentity.explainFront.step}
						header={strings.validateIdentity.explainFront.header}
						description={strings.validateIdentity.explainFront.description}
						image={require("../../resources/images/validateIdentityExplainFront.png")}
						buttonAction={startCamera}
					/>
				)}
			/>
		);
	}

	private onBarcodeScanned(data: string, type: BarcodeType) {
		if (type !== "pdf417") {
			return;
		}
		const documentData = fromPDF417(data);
		if (documentData) {
			this.setState({ documentData });
		}
	}
}
