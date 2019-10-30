import * as t from "io-ts";

export const errorDataCodec = t.type({
	errorCode: t.string,
	message: t.string
});
export type ErrorData = typeof errorDataCodec._A;

function error(errorCode: string, message: string): { errorCode: string; message: string } {
	return { errorCode, message };
}

export const serviceErrors = {
	common: {
		FETCH_ERR: error("FETCH_ERR", "Error al enviar peticion al servidor."),
		JSON_ERR: error("JSON_ERR", "Error al interpretar formato de respuesta."),
		PARSE_ERR: error("PARSE_ERR", "Error al interpretar formato de respuesta.")
	}
};
