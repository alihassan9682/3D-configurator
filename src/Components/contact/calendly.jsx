/** @format */

//calendly.com/alihassan9682/blenspark-consultations

import React from 'react';
import { InlineWidget } from 'react-calendly';

const CalendlyWidget = () => {
  return (
    <div style={{ overflow: "hidden" }}>
      <InlineWidget url="https://calendly.com/alihassan9682/blenspark-consultations" />
    </div>
  );
};

export default CalendlyWidget;
