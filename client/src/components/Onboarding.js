import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Button,
  FormControl,
  Paper,
  Typography,
} from "@mui/material";
import Toggle from "./Inputs/Toggle";
import TextInput from "./Inputs/TextInput";

const Onboarding = () => {
  const navigate = useNavigate();

  const [onboardingForm, setOnboardingForm] = useState({ isFetching: true, steps: [] });
  const [onboardingData, setOnboardingData] = useState({});
  const [currentFormPage, setCurrentFormPage] = useState(0);
  const [validity, setValidity] = useState({ current: false, all: false })
  const [displayWarning, setDisplayWarning] = useState(true)

  useEffect(() => {
    const fetchOnboardingFormData = async () => {
      setOnboardingForm((prev) => ({ ...prev, isFetching: true }));
      try {
        const { data } = await axios.get("/api/onboarding");
        setOnboardingForm(data);
      } catch (error) {
        console.error(error);
      } finally {
        setOnboardingForm((prev) => ({ ...prev, isFetching: false }));
      }
    };

    fetchOnboardingFormData();
  }, []);

  useEffect(() => {
    if (currentFormPage !== onboardingForm.steps.length - 1) setDisplayWarning(!validity.current)
    else setDisplayWarning(!validity.all)
  }, [validity.all, validity.current, currentFormPage])

  const handlePageMove = {
    next: () => setCurrentFormPage(page => page + 1),
    back: () => setCurrentFormPage(page => page - 1),
  }

  const onInputChange = (event, type = "text") => {
    const newState = {
      ...onboardingData,
      [event.target.name]:
        type === "checkbox" ? event.target.checked : event.target.value,
    };
    setOnboardingData(newState);
    areAllInputsValid(newState)
    isCurrentPageValid(newState)
  };

  const saveOnboarding = () => {
    navigate("/home", { state: { onboarding: true } });
  };

  const isCurrentPageValid = (state) => {
    setValidity(prev => ({
      ...prev,
      current: onboardingForm.steps[currentFormPage].every(q => !q.required || !!state[q.name]),
    }))
  }

  const areAllInputsValid = (state) => {
    setValidity(prev => ({
      ...prev,
      all: onboardingForm.steps[currentFormPage].every(q => !q.required || !!state[q.name]),
    }))
  }

  const renderButton = (text, options) => {
    if (options.hide) return null;

    return (
      <Button
        sx={{
          mt: 4,
          alignContent: 'right',
          bgcolor: '#3A8DFF',
          px: 3.75,
          py: 0.625,
          color: 'white',
          fontSize: '15px',
          '&:disabled': {
            color: 'white',
            fontSize: '15px',
            bgcolor: 'lightgrey',
          },
          '&:hover': {
            bgcolor: '#3A8DFF',
          },
        }}
        type="submit"
        variant="contained"
        size="large"
        onClick={options.onClick}
        disabled={options.disabled}
      >
        {text}
      </Button>
    );
  };

  const renderInput = (inputObj) => {
    const InputType = inputObj.type.includes('text') ? TextInput : Toggle;
    return (
      <FormControl key={inputObj.name} fullWidth sx={{ p: 2 }}>
        <InputType
          label={inputObj.label}
          name={inputObj.name}
          required={inputObj.required}
          onboardingData={onboardingData}
          onChange={onInputChange}
          textarea={inputObj.type === "multiline-text"}
        />
      </FormControl>
    )
  }

  const navButtons = [
    { label: "Back", options: { hide: currentFormPage === 0, onClick: handlePageMove.back } },
    { label: "Finish", options: { hide: currentFormPage !== onboardingForm.steps.length - 1, onClick: saveOnboarding, disabled: !validity.all } },
    { label: "Next", options: { hide: currentFormPage === onboardingForm.steps.length - 1, onClick: handlePageMove.next, disabled: !validity.current } },
  ]

  if (onboardingForm.isFetching) return <div>Loading...</div>;

  return (
    <Grid container justifyContent="center">
      <Paper sx={{
        padding: 5,
        backgroundColor: "#F7F9FD",
        width: '30%',
      }}>
        {onboardingForm.steps[currentFormPage].map(renderInput)}
        <FormControl fullWidth sx={{ p: 2 }}>
          {!!displayWarning &&
            <Typography sx={{ color: 'red' }}>
              Please fill all the required fields before proceeding.
            </Typography>
          }

          <Grid container justifyContent="space-between">
            <Grid item>
              {navButtons.map(b => renderButton(b.label, b.options))}
            </Grid>
          </Grid>
        </FormControl>
      </Paper>
    </Grid>
  );
};

export default Onboarding;