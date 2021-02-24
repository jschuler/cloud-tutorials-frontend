import React from 'react';
import {
  Form,
  FormGroup,
  TextInput,
  Checkbox,
  Popover,
  ActionGroup,
  Button,
  FormHelperText
} from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';

class AppOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value1: '',
      value2: '',
      value3: '',
      validated: 'noval'
    };
    this.handleTextInputChange1 = value1 => {
      this.setState({ 
        value1,
        validated: value1 === 'kafka-test' ? 'success' : 'error'
      });
    };
    this.handleTextInputChange2 = value2 => {
      this.setState({ value2 });
    };
    this.handleTextInputChange3 = value3 => {
      this.setState({ value3 });
    };
  }

  render() {
    const { value1, value2, value3, validated } = this.state;

    return (
      <Form>
        <div>
          <header className="pf-c-modal-box__header">
            <h1 id="pf-modal-part-1" className="pf-c-modal-box__title">
              <span className="pf-c-modal-box__title-text">
                Create a Kafka instance
              </span>
            </h1>
          </header>
          <div id="pf-modal-part-2" className="pf-c-modal-box__body">
            <form noValidate className="pf-c-form">
              <div className="pf-c-form__group">
                <div className="pf-c-form__group-label">
                  <label
                    className="pf-c-form__label"
                    htmlFor="form-instance-name"
                  >
                    <span className="pf-c-form__label-text">Instance name</span>
                    <span
                      className="pf-c-form__label-required"
                      aria-hidden="true"
                    >
                      {" "}
                      *
                    </span>
                  </label>{" "}
                </div>
                <div className="pf-c-form__group-control">
                  <FormGroup
                    label="Name"
                    labelIcon={
                      <Popover bodyContent="Kafka stream name">
                        <button
                          type="button"
                          aria-label="More info for name field"
                          onClick={(e) => e.preventDefault()}
                          aria-describedby="simple-form-name-01"
                          className="pf-c-form__group-label-help"
                        >
                          <HelpIcon noVerticalAlign />
                        </button>
                      </Popover>
                    }
                    isRequired
                    fieldId="simple-form-name-01"
                    helperText={
                      <FormHelperText
                        icon={<ExclamationCircleIcon />}
                        isHidden={validated !== "noval"}
                      >
                        Name must match exactly 'kafka-test'
                      </FormHelperText>
                    }
                    helperTextInvalid="Name must match exactly 'kafka-test'"
                    helperTextInvalidIcon={<ExclamationCircleIcon />}
                    validated={validated}
                  >
                    <TextInput
                      isRequired
                      type="text"
                      id="simple-form-name-01"
                      name="simple-form-name-01"
                      aria-describedby="simple-form-name-01-helper"
                      value={value1}
                      onChange={this.handleTextInputChange1}
                      validated={validated}
                    />
                  </FormGroup>
                  {/* <input
                    id="form-instance-name"
                    name="instance-name"
                    className="pf-c-form-control"
                    type="text"
                    aria-invalid="false"
                    required
                    defaultValue
                  />
                  <div
                    className="pf-c-form__helper-text"
                    id="form-instance-name-helper"
                    aria-live="polite"
                  >
                    Valid characters for instance name are lowercase letters
                    from a to z, numbers from 0 to 9, and hyphens (-). The name
                    must start with a letter, and must end with a letter or
                    number.
                  </div> */}
                </div>
              </div>
              <div className="pf-c-form__group">
                <div className="pf-c-form__group-label">
                  <label
                    className="pf-c-form__label"
                    htmlFor="form-cloud-provider-name"
                  >
                    <span className="pf-c-form__label-text">
                      Cloud provider
                    </span>
                  </label>{" "}
                </div>
                <div className="pf-c-form__group-control">
                  <div className="pf-c-tile pf-m-selected" tabIndex={0}>
                    <div className="pf-c-tile__header">
                      <div className="pf-c-tile__icon">
                        <svg
                          fill="black"
                          height="2em"
                          width="2em"
                          viewBox="0 0 640 512"
                          aria-hidden="true"
                          role="img"
                          className="mk--create-instance__tile--icon"
                          style={{ verticalAlign: "-0.25em" }}
                        >
                          <path d="M180.41 203.01c-.72 22.65 10.6 32.68 10.88 39.05a8.164 8.164 0 0 1-4.1 6.27l-12.8 8.96a10.66 10.66 0 0 1-5.63 1.92c-.43-.02-8.19 1.83-20.48-25.61a78.608 78.608 0 0 1-62.61 29.45c-16.28.89-60.4-9.24-58.13-56.21-1.59-38.28 34.06-62.06 70.93-60.05 7.1.02 21.6.37 46.99 6.27v-15.62c2.69-26.46-14.7-46.99-44.81-43.91-2.4.01-19.4-.5-45.84 10.11-7.36 3.38-8.3 2.82-10.75 2.82-7.41 0-4.36-21.48-2.94-24.2 5.21-6.4 35.86-18.35 65.94-18.18a76.857 76.857 0 0 1 55.69 17.28 70.285 70.285 0 0 1 17.67 52.36l-.01 69.29zM93.99 235.4c32.43-.47 46.16-19.97 49.29-30.47 2.46-10.05 2.05-16.41 2.05-27.4-9.67-2.32-23.59-4.85-39.56-4.87-15.15-1.14-42.82 5.63-41.74 32.26-1.24 16.79 11.12 31.4 29.96 30.48zm170.92 23.05c-7.86.72-11.52-4.86-12.68-10.37l-49.8-164.65c-.97-2.78-1.61-5.65-1.92-8.58a4.61 4.61 0 0 1 3.86-5.25c.24-.04-2.13 0 22.25 0 8.78-.88 11.64 6.03 12.55 10.37l35.72 140.83 33.16-140.83c.53-3.22 2.94-11.07 12.8-10.24h17.16c2.17-.18 11.11-.5 12.68 10.37l33.42 142.63L420.98 80.1c.48-2.18 2.72-11.37 12.68-10.37h19.72c.85-.13 6.15-.81 5.25 8.58-.43 1.85 3.41-10.66-52.75 169.9-1.15 5.51-4.82 11.09-12.68 10.37h-18.69c-10.94 1.15-12.51-9.66-12.68-10.75L328.67 110.7l-32.78 136.99c-.16 1.09-1.73 11.9-12.68 10.75h-18.3zm273.48 5.63c-5.88.01-33.92-.3-57.36-12.29a12.802 12.802 0 0 1-7.81-11.91v-10.75c0-8.45 6.2-6.9 8.83-5.89 10.04 4.06 16.48 7.14 28.81 9.6 36.65 7.53 52.77-2.3 56.72-4.48 13.15-7.81 14.19-25.68 5.25-34.95-10.48-8.79-15.48-9.12-53.13-21-4.64-1.29-43.7-13.61-43.79-52.36-.61-28.24 25.05-56.18 69.52-55.95 12.67-.01 46.43 4.13 55.57 15.62 1.35 2.09 2.02 4.55 1.92 7.04v10.11c0 4.44-1.62 6.66-4.87 6.66-7.71-.86-21.39-11.17-49.16-10.75-6.89-.36-39.89.91-38.41 24.97-.43 18.96 26.61 26.07 29.7 26.89 36.46 10.97 48.65 12.79 63.12 29.58 17.14 22.25 7.9 48.3 4.35 55.44-19.08 37.49-68.42 34.44-69.26 34.42zm40.2 104.86c-70.03 51.72-171.69 79.25-258.49 79.25A469.127 469.127 0 0 1 2.83 327.46c-6.53-5.89-.77-13.96 7.17-9.47a637.37 637.37 0 0 0 316.88 84.12 630.22 630.22 0 0 0 241.59-49.55c11.78-5 21.77 7.8 10.12 16.38zm29.19-33.29c-8.96-11.52-59.28-5.38-81.81-2.69-6.79.77-7.94-5.12-1.79-9.47 40.07-28.17 105.88-20.1 113.44-10.63 7.55 9.47-2.05 75.41-39.56 106.91-5.76 4.87-11.27 2.3-8.71-4.1 8.44-21.25 27.39-68.49 18.43-80.02z" />
                        </svg>
                      </div>
                      <div className="pf-c-tile__title">
                        Amazon Web Services
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pf-c-form__group">
                <div className="pf-c-form__group-label">
                  <label
                    className="pf-c-form__label"
                    htmlFor="form-cloud-region-option"
                  >
                    <span className="pf-c-form__label-text">Cloud region</span>
                  </label>{" "}
                </div>
                <div className="pf-c-form__group-control">
                  <select
                    id="cloud-region-select"
                    name="cloud-region"
                    aria-label="Cloud region"
                    className="pf-c-form-control"
                    aria-invalid="false"
                    data-ouia-component-type="PF4/FormSelect"
                    data-ouia-safe="true"
                    data-ouia-component-id="OUIA-Generated-FormSelect-default-1"
                  >
                    <option className value="please_select">
                      Please select
                    </option>
                    <option className value="us-east-1">
                      US East, N. Virginia
                    </option>
                  </select>
                </div>
              </div>
              <div className="pf-c-form__group">
                <div className="pf-c-form__group-label">
                  <label
                    className="pf-c-form__label"
                    htmlFor="availability-zones"
                  >
                    <span className="pf-c-form__label-text">
                      Availabilty zones
                    </span>
                  </label>{" "}
                </div>
                <div className="pf-c-form__group-control">
                  <div
                    className="pf-c-toggle-group"
                    role="group"
                    aria-label="Availability zone selection"
                  >
                    <div className="pf-c-toggle-group__item" value="single">
                      <button
                        type="button"
                        className="pf-c-toggle-group__button pf-m-selected"
                        aria-pressed="true"
                        disabled
                        id="single"
                      >
                        <span className="pf-c-toggle-group__text">Single</span>
                      </button>
                    </div>
                    <div
                      className="pf-c-divider pf-m-vertical"
                      role="separator"
                    />
                    <div className="pf-c-toggle-group__item" value="multi">
                      <button
                        type="button"
                        className="pf-c-toggle-group__button pf-m-selected"
                        aria-pressed="true"
                        id="multi"
                      >
                        <span className="pf-c-toggle-group__text">Multi</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
            <br />
            <br />
          </div>
          <footer className="pf-c-modal-box__footer">
            <button
              aria-disabled="false"
              className="pf-c-button pf-m-primary pf-m-progress"
              type="button"
              data-ouia-component-type="PF4/Button"
              data-ouia-safe="true"
              data-ouia-component-id="OUIA-Generated-Button-primary-2"
            >
              Create instance
            </button>
            <button
              aria-disabled="false"
              className="pf-c-button pf-m-link"
              type="button"
              data-ouia-component-type="PF4/Button"
              data-ouia-safe="true"
              data-ouia-component-id="OUIA-Generated-Button-link-1"
            >
              Cancel
            </button>
          </footer>
        </div>
        {/* <FormGroup label="Email" isRequired fieldId="simple-form-email-01">
          <TextInput
            isRequired
            type="email"
            id="simple-form-email-01"
            name="simple-form-email-01"
            value={value2}
            onChange={this.handleTextInputChange2}
          />
        </FormGroup> */}
        {/* <FormGroup label="Phone number" isRequired fieldId="simple-form-number-01">
          <TextInput
            isRequired
            type="tel"
            id="simple-form-number-01"
            placeholder="555-555-5555"
            name="simple-form-number-01"
            value={value3}
            onChange={this.handleTextInputChange3}
          />
        </FormGroup> */}
        {/* <FormGroup isInline fieldId="simple-form-checkbox-group" label="How can we contact you?" isRequired>
          <Checkbox label="Email" aria-label="Email" id="inlinecheck01" />
          <Checkbox label="Phone" aria-label="Phone" id="inlinecheck02" />
          <Checkbox label="Please don't contact me" aria-label="Please don't contact me" id="inlinecheck03" />
        </FormGroup>
        <FormGroup label="Additional Note" fieldId="simple-form-note-01">
          <TextInput isDisabled type="text" id="simple-form-note-01" name="simple-form-number" value="disabled" />
        </FormGroup>
        <FormGroup fieldId="checkbox01">
          <Checkbox label="I'd like updates via email" id="checkbox01" name="checkbox01" aria-label="Update via email" />
        </FormGroup> */}
        {/* <ActionGroup>
          <Button variant="primary">Create kafka stream</Button>
          <Button variant="link">Cancel</Button>
        </ActionGroup> */}
      </Form>
    );
  }
}

export default AppOne;