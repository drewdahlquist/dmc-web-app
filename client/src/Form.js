import React, { useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import {
    Box,
    Button,
    CheckBox,
    Collapsible,
    DateInput,
    Form,
    FormField,
    Grommet,
    Heading,
    Layer,
    RangeInput,
    ResponsiveContext,
    Select,
    TextArea,
    TextInput,
} from 'grommet'
import { grommet } from 'grommet/themes'
import { FormClose, Notification, } from 'grommet-icons'

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
    }
}

export const ExperimentForm = () => (
    <Grommet full theme={grommet}>
        <Box fill align='center' justify='center'>
            <Box width='medium'>
                <Formik
                    initialValues={{
                        machine: 'SRP',
                        experimentName: '',
                        positions: '8',
                        frequency: '',
                        endDate: '',
                        confirmation: false,
                    }}
                    validationSchema={Yup.object({
                        machine: Yup
                            .string('Select the HTP machine')
                            .oneOf(
                                ['SRP', 'SRP2', 'RootBot'],
                                'Select a valid machine'
                            )
                            .required('Required'),
                        experimentName: Yup
                            .string('Enter the experiment name')
                            .min(4, 'Must be 4 characters or more')
                            .max(64, 'Must be 64 characters or less')
                            .required('Required'),
                        positions: Yup
                            .number('Select number of positions')
                            .min(1, 'Must have at least 1 position')
                            .max(8, 'Must have at most 8 positions')
                            .required('Required'),
                        frequency: Yup
                            .number('Enter the frequency of photos')
                            .min(1, 'Must be at least 1 hour in between photos')
                            .max(72, 'Must be at most 72 hours in between photos')
                            .required('Required'),
                        endDate: Yup
                            .date()
                            .min(new Date())
                            .max(new Date(new Date().getTime() + (365 * 24 * 60 * 60 * 1000)))
                            .required('Required'),
                        confirmation: Yup
                            .boolean()
                            .oneOf([true], 'Please read & confirm')
                            .required('Required'),
                    })}
                    onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
                        setSubmitting(true)
                        // axios.post('', values, axiosConfig)
                        //     .then((res) => {
                        //         console.log(res.data)
                        //         resetForm() // Only triggers when Raspbery Pi API is running
                        //     })
                        //     .catch((error) => {
                        //         console.error(error)
                        //     })

                        alert(JSON.stringify(values, null, 2)) // TODO: REMOVE. testing
                        resetForm({}) // TODO: REMOVE. Don't want this behavior, but here for testing since pi API won't always be running. RE: axios.post method above
                        // TODO: Reset these fields. Won't happen for some reason...
                        setFieldValue(values.endDate, [])
                        setFieldValue(values.confirmation, false)
                        setSubmitting(false)
                    }}
                    enableReinitialize
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        setFieldValue,
                        setValues,
                    }) => (
                        <Form onSubmit={handleSubmit}>
                            <FormField
                                name='machine'
                                label='Machine'
                                error={touched.machine && errors.machine}
                                component={Select}
                                options={['SRP', 'SRP2', 'RootBot']}
                                value={values.machine}
                                onChange={handleChange}
                            // tabIndex={0} // Not working on Select for some reason
                            />

                            <FormField
                                name='experimentName'
                                label='Experiment Name'
                                error={touched.experimentName && errors.experimentName}
                                component={TextInput}
                                value={values.experimentName}
                                onChange={handleChange}
                                placeholder='Name of your experiment'
                            />

                            <FormField
                                name='positions'
                                label='Positions'
                                error={touched.positions && errors.positions}
                                component={Select}
                                options={['1', '2', '3', '4', '5', '6', '7', '8']}
                                value={values.positions}
                                onChange={handleChange}
                            />

                            <FormField
                                name='frequency'
                                label='Frequency (hrs)'
                                error={touched.frequency && errors.frequency}
                                component={TextInput}
                                value={values.frequency}
                                onChange={handleChange}
                                placeholder='Frequency in hours (e.g., 3.5)'
                            />

                            <FormField
                                name='endDate'
                                label='End Date'
                                error={touched.endDate && errors.endDate}
                                component={DateInput}
                                value={values.endDate}
                                onChange={handleChange}
                            >
                                <DateInput name='endDate' format='mm/dd/yyyy' />
                            </FormField>

                            <FormField
                                name='confirmation'
                                label='Confirm all samples are in place.'
                                error={touched.confirmation && errors.confirmation}
                                component={CheckBox}
                                value={values.confirmation}
                                onChange={handleChange}
                            />

                            <Box direction='row' gap='medium' flex align='center' justify='center'>
                                <Button type='reset' secondary label='Reset' />
                                <Button type='submit' primary label='Submit' />
                            </Box>
                        </Form>)}
                </Formik>
            </Box>
        </Box>
    </Grommet >
);