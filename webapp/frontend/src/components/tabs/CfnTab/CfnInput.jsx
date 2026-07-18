/**
 * CFN Input Component
 * Handles CloudFormation template input, file upload, and options
 */

import { Info, Upload } from 'lucide-react';
import SubmitButton from '../../common/SubmitButton.jsx';
import CfnOptions from '../../options/CfnOptions.jsx';
import ExampleSelector from '../../common/ExampleSelector.jsx';
import YamlEditor from '../../common/YamlEditor.jsx';
import { EXAMPLE_TYPES } from '../../../utils/constants.js';

function CfnInput({
  templateContent,
  setTemplateContent,
  outputFormat,
  setOutputFormat,
  extraArgs,
  setExtraArgs,
  embedAllIcons,
  setEmbedAllIcons,
  errorMessage,
  setErrorMessage,
  isSubmitting,
  onSubmit,
  onFileUpload,
}) {
  return (
    <div className="w-full flex flex-col bg-[var(--color-panel)] p-6 rounded-lg shadow-lg space-y-4">
      <h2 className="text-2xl font-bold">CloudFormation Template</h2>

      <ExampleSelector type={EXAMPLE_TYPES.CFN} onSelectExample={setTemplateContent} />

      <YamlEditor
        path="template.yaml"
        value={templateContent}
        onChange={(val) => {
          setTemplateContent(val);
          if (errorMessage) setErrorMessage('');
        }}
      />

      <label className="text-sm text-white mt-2 flex items-center gap-2">
        <Upload className="w-4 h-4" />
        Or: Upload a template file (.yaml, .yml, .json)
      </label>
      <input type="file" accept=".yaml,.yml,.json" className="text-white" onChange={onFileUpload} />

      <CfnOptions
        outputFormat={outputFormat}
        setOutputFormat={setOutputFormat}
        extraArgs={extraArgs}
        setExtraArgs={setExtraArgs}
        embedAllIcons={embedAllIcons}
        setEmbedAllIcons={setEmbedAllIcons}
      />

      <SubmitButton
        onClick={onSubmit}
        className="w-full mt-2"
        disabled={!templateContent.trim() || isSubmitting}
      >
        {isSubmitting ? 'Generating…' : 'Generate'}
      </SubmitButton>

      {!templateContent.trim() && !isSubmitting && (
        <p className="text-sm text-yellow-400 mt-1 flex items-center gap-2">
          <Info className="w-4 h-4" />
          Please paste or select a CloudFormation template to generate a diagram
        </p>
      )}
    </div>
  );
}

export default CfnInput;
