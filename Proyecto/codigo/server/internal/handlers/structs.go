package handlers

type SuccessMessage struct {
	Body struct {
		Message string `json:"message" example:"La serie se ha creado exitosamente" doc:"Mensaje de éxito"`
	}
}
