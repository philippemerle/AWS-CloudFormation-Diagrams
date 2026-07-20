/**
 * CFN Output Component
 * Displays the generated diagram and command execution details
 */

import { motion } from 'motion/react';
import DiagramViewer from '../../common/DiagramViewer.jsx';
import ErrorAlert from '../../common/ErrorAlert.jsx';
import CommandDetails from '../../common/CommandDetails.jsx';
import DownloadButton from '../../common/DownloadButton.jsx';
import NotationOptions from '../../options/NotationOptions.jsx';

function CfnOutput({
  errorMessage,
  diagram,
  outputFormat,
  mimeType,
  filename,
  command,
  stdout,
  stderr,
  message,
  viewerKey,
  viewerRef,
  onViewerLoad,
  isSubmitting,
}) {
  return (
    <div className="w-full flex flex-col bg-[var(--color-panel)] p-6 rounded-lg shadow-lg text-white space-y-4">
      <h2 className="text-2xl font-bold">Output</h2>

      <ErrorAlert message={errorMessage} showDetailsButton={!!(stderr || stdout)} />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <DiagramViewer
          diagram={diagram}
          outputFormat={outputFormat}
          mimeType={mimeType}
          viewerKey={viewerKey}
          viewerRef={viewerRef}
          onViewerLoad={onViewerLoad}
          isLoading={isSubmitting}
        />
      </motion.div>

      <DownloadButton
        diagram={diagram}
        mimeType={mimeType}
        outputFormat={outputFormat}
        filename={filename}
        filenameFallback={`cfn-diagram.${(outputFormat || 'png').toLowerCase()}`}
      />

      <CommandDetails
        command={command}
        stdout={stdout}
        stderr={stderr}
        message={message}
        titleClassName="text-white"
      />

      {diagram && <NotationOptions diagramType="cfn" />}
    </div>
  );
}

export default CfnOutput;
