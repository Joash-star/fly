import "./scss/index.scss";

import * as React from "react";

import { Button, Form, TextField } from "../..";
import { maybe } from "../../../core/utils";
import { TypedAccountRegisterMutation } from "./queries";
import { RegisterAccount } from "./types/RegisterAccount";

import { AlertManager, useAlert } from "react-alert";

const showSuccessNotification = (
  data: RegisterAccount,
  hide: () => void,
  alert: AlertManager
) => {
  const successful = maybe(() => !data.accountRegister.errors.length);

  if (successful) {
    hide();
    alert.show(
      {
        title: data.accountRegister.requiresConfirmation
        ? "Please check your e-mail for further instructions"
        : "New user has been created",
      },
      { type: "success", timeout: 5000 }
    );
  }
};

const RegisterForm: React.FC<{ hide: () => void }> = ({ hide }) => {
  const alert = useAlert();
  return (
    <TypedAccountRegisterMutation
      onCompleted={data => showSuccessNotification(data, hide, alert)}
    >
      {(registerCustomer, { loading, data }) => {
        return (
          <Form
            errors={maybe(() => data.accountRegister.errors, [])}
            onSubmit={(event, { email, password }) => {
              event.preventDefault();
              const redirectUrl = window.location.origin;
              registerCustomer({ variables: { email, password, redirectUrl } });
            }}
          >
            <TextField
              name="email"
              autoComplete="email"
              label="Email Address"
              type="email"
              required
            />
            <TextField
              name="password"
              autoComplete="password"
              label="Password"
              type="password"
              required
            />
            <div className="login__content__button">
              <Button type="submit" {...(loading && { disabled: true })}>
                {loading ? "Loading" : "Register"}
              </Button>
            </div>
          </Form>
        );
      }}
    </TypedAccountRegisterMutation>
  );
};

export default RegisterForm;
