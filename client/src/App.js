import React, { useCallback, useEffect, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Collapsible,
  Form,
  FormField,
  Grommet,
  Heading,
  Layer,
  List,
  ResponsiveContext,
  Select,
  Text,
  TextArea,
  TextInput,
} from "grommet";
import { grommet } from "grommet/themes";
import {
  FormClose,
  Notification,
  Menu,
  Favorite,
  ShareOption,
} from "grommet-icons";
import { ExperimentForm } from "./Form";

const theme = {
  global: {
    // colors: {
    //   brand: 'brand'
    // },
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px",
    },
  },
};

const AppBar = (props) => (
  <Box
    tag="header"
    direction="row"
    align="center"
    justify="between"
    background="brand"
    pad={{ left: "medium", right: "small", vertical: "small" }}
    elevation="medium"
    style={{ zIndex: "1" }}
    {...props}
  />
);

const ExpCardHeader = ({ children, title, subTitle, size, ...rest }) => (
  <Box gap="small" align="center" direction="row" pad="small" {...rest}>
    {children}
    <Box>
      <Text size={size} weight="bold">
        {title}
      </Text>
      <Text size={size}>{subTitle}</Text>
    </Box>
  </Box>
);

const ExpCardBody = ({ positions, frequency, endDate, size, ...rest }) => (
  <Box gap="xxsmall" align="start" pad="small" {...rest}>
    <Text size={size}>Positions: {positions}</Text>
    <Text size={size}>Frequency: {frequency}</Text>
    <Text size={size}>End Date: {endDate}</Text>
  </Box>
);

const ExperimentCards = ({ data }) =>
  data.map((value) => (
    <Card
      style={{ height: "small", width: "95%", minHeight: "222px" }}
      background="light-1"
      margin="xsmall"
    >
      <CardHeader pad={{ horizontal: "small" }}>
        <ExpCardHeader title={value.experimentName} subTitle={value.machine} />
      </CardHeader>
      <CardBody pad={{ horizontal: "small" }}>
        <ExpCardBody
          positions={value.positions}
          frequency={value.frequency}
          endDate={value.endDate}
        />
      </CardBody>
      <CardFooter pad={{ horizontal: "small" }} background="light-2">
        <Button icon={<ShareOption color="plain" />} hoverIndicator />
      </CardFooter>
    </Card>
  ));

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [experiments, setExperiments] = useState([]);

  const wrapperSetExperiments = useCallback(
    (val) => {
      setExperiments(val);
    },
    [setExperiments]
  );

  useEffect(() => {
    async function getExperiments() {
      const res = await fetch("http://192.168.1.120:5000/experiment/");

      // TODO: Remove. For dev only
      if (!res.ok) {
        alert("Error fetching data");
        return;
      }

      const data = await res.json();
      setExperiments(data);
    }

    getExperiments();

    return;
  }, [experiments.length]);

  return (
    <Grommet theme={grommet} full>
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box fill>
            <AppBar>
              what can go here?
              <Heading level="3" margin="none">
                DMC Phenotyping
              </Heading>
              <Button
                icon={<Menu />}
                onClick={() => setShowSidebar(!showSidebar)}
              />
            </AppBar>

            <Box direction="row" flex overflow={{ horizontal: "hidden" }}>
              <Box flex align="center" justify="center">
                <ExperimentForm parentSetExperiments={wrapperSetExperiments} />
              </Box>

              {!showSidebar || size !== "small" ? (
                <Collapsible direction="horizontal" open={showSidebar}>
                  <Box
                    flex
                    width="medium"
                    background="light-2"
                    elevation="small"
                    align="center"
                    justify="start"
                    overflow={"scroll"}
                  >
                    <Heading level="3" margin="xsmall">
                      Experiments
                    </Heading>
                    <ExperimentCards data={experiments}></ExperimentCards>
                  </Box>
                </Collapsible>
              ) : (
                <Layer>
                  <Box
                    background="light-2"
                    tag="header"
                    justify="end"
                    align="center"
                    direction="row"
                  >
                    <Button
                      icon={<FormClose />}
                      onClick={() => setShowSidebar(false)}
                    />
                  </Box>
                  <Box
                    fill
                    background="light-2"
                    align="center"
                    justify="center"
                    overflow={"scroll"}
                  >
                    <ExperimentCards></ExperimentCards>
                  </Box>
                </Layer>
              )}
            </Box>
          </Box>
        )}
      </ResponsiveContext.Consumer>
    </Grommet>
  );
}

export default App;
