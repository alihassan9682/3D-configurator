import React from 'react';
import { ModelViewer, ARView } from './exporter';

const ViewSelector = ({ activeView, state, setModel }) => {
    return (
        <>
            {activeView === "VR" ? (
                <ModelViewer scale={state.scale} levels={state.levels} setModel={setModel} />
            ) : activeView === "AR" ? (
                <ARView modal={state.model} />
            ) : (
                <div className="flex-1 p-4 md:p-6 flex items-center justify-center h-full">
                    <p className="text-red-700">Select a view to start.</p>
                </div>
            )}
        </>
    );
};

export default ViewSelector;
