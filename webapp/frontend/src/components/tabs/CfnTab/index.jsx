/**
 * CFN Tab Container
 * Main component that orchestrates CloudFormation diagram generation
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { generateCfnDiagram } from '../../../services/diagramApi.js';
import { useViewerSync } from '../../../hooks/useViewerSync.js';
import { useFileUpload } from '../../../hooks/useFileUpload.js';
import { useDiagramGeneration } from '../../../hooks/useDiagramGeneration.js';
import { useHistorySync } from '../../../hooks/useHistorySync.js';
import { useScrollToOutput } from '../../../hooks/useScrollToOutput.js';
import CfnInput from './CfnInput.jsx';
import CfnOutput from './CfnOutput.jsx';

function CfnTab({ historyContext }) {
  // Input states
  const [templateContent, setTemplateContent] = useState('');
  const [extraArgs, setExtraArgs] = useState('');
  const [embedAllIcons, setEmbedAllIcons] = useState(false);

  // Diagram generation hook
  const {
    outputFormat,
    handleOutputFormatChange,
    diagram,
    command,
    message,
    mimeType,
    filename,
    stdout,
    stderr,
    errorMessage,
    isSubmitting,
    viewerKey,
    progressStep,
    handleSubmit: handleDiagramSubmit,
    setErrorMessage,
    restoreDiagram,
  } = useDiagramGeneration({
    apiFunction: generateCfnDiagram,
    validateInput: () => {
      if (!templateContent.trim()) {
        return 'Template content is required.';
      }
      return null;
    },
    diagramType: 'cfn',
  });

  // dot_json viewer sync
  const { viewerRef, handleViewerLoad } = useViewerSync({ diagram, outputFormat });

  // Auto-scroll to output when diagram is ready
  const outputRef = useScrollToOutput(progressStep);

  // File upload handler
  const { createFileInputHandler } = useFileUpload();

  useHistorySync({
    diagramType: 'cfn',
    historyContext,
    outputFormat,
    diagram,
    mimeType,
    filename,
    progressStep,
    restoreDiagram,
    buildInput: () => ({ template: templateContent, outputFormat, extraArgs, embedAllIcons }),
    buildPreview: () => templateContent.substring(0, 100),
    restoreInput: (input) => {
      setTemplateContent(input.template || '');
      setExtraArgs(input.extraArgs || '');
      setEmbedAllIcons(input.embedAllIcons || false);
    },
  });

  const handleSubmit = () => {
    handleDiagramSubmit({
      template: templateContent,
      outputFormat,
      extraArgs,
      embedAllIcons,
    });
  };

  return (
    <div className="flex flex-col w-full gap-6">
      <CfnInput
        templateContent={templateContent}
        setTemplateContent={setTemplateContent}
        outputFormat={outputFormat}
        setOutputFormat={handleOutputFormatChange}
        extraArgs={extraArgs}
        setExtraArgs={setExtraArgs}
        embedAllIcons={embedAllIcons}
        setEmbedAllIcons={setEmbedAllIcons}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onFileUpload={createFileInputHandler(setTemplateContent, setErrorMessage)}
      />

      <div ref={outputRef}>
        <CfnOutput
          errorMessage={errorMessage}
          diagram={diagram}
          outputFormat={outputFormat}
          mimeType={mimeType}
          filename={filename}
          command={command}
          stdout={stdout}
          stderr={stderr}
          message={message}
          viewerKey={viewerKey}
          viewerRef={viewerRef}
          onViewerLoad={handleViewerLoad}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}

CfnTab.propTypes = {
  historyContext: PropTypes.shape({
    addToHistory: PropTypes.func.isRequired,
    restoredItem: PropTypes.object,
    clearRestoredItem: PropTypes.func.isRequired,
  }),
};

export default CfnTab;
