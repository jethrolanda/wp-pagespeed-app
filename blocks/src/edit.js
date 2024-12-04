import { useEffect, useState } from "@wordpress/element";
import { store as coreDataStore } from "@wordpress/core-data";
import { useSelect } from "@wordpress/data";
import {
  __experimentalInputControl as InputControl,
  Button,
  TextareaControl,
  PanelBody,
  PanelRow,
  ColorPicker,
  CheckboxControl,
  RadioControl,
  ToggleControl,
  SelectControl,
  Spinner
} from "@wordpress/components";

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
  InspectorControls,
  BlockControls,
  AlignmentToolbar,
  RichText,
  useBlockProps,
  InnerBlocks
} from "@wordpress/block-editor";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {Element} Element to render.
 */

function useCustomPatternBlocks(props) {
  const { patterns, hasResolved } = useSelect(
    (select) => {
      const selectorArgs = ["postType", "wp_block", { per_page: -1 }];

      return {
        patterns: select(coreDataStore).getEntityRecords(...selectorArgs),
        hasResolved: select(coreDataStore).hasFinishedResolution(
          "getEntityRecords",
          selectorArgs
        )
      };
    },
    [props]
  );

  return { patterns, hasResolved };
  // const [data, setData] = useState([]);

  // useEffect(() => {
  //   const test = wp.data
  //     .select("core")
  //     .getEntityRecords("postType", "wp_block", { per_page: -1 });
  //   setData(test);
  // }, []);

  // return data;
}

export default function Edit(props) {
  const { patterns, hasResolved } = useCustomPatternBlocks(props);
  const options = patterns
    ? patterns.map((p) => {
        return { value: p.id, label: p.title.raw };
      })
    : [];
  options.unshift({ value: "", label: "Select a Pattern" });

  const blockProps = useBlockProps();

  const { attributes, setAttributes } = props;
  const {
    successMessagePattern,
    failMessagePattern,
    bannedMessagePattern,
    bannedStates
  } = attributes;

  const MY_TEMPLATE = [
    [
      "core/heading",
      {
        content:
          "Check if our services are near your area. Enter your zipcode below."
      }
    ],
    // [ 'core/form-input', { label: 'Enter your zipcode', placeholder: 'Zipcode', required: true } ],
    ["core/button", { text: "Submit" }]
  ];

  function onChangeSuccessMessagePattern(value) {
    props.setAttributes({ successMessagePattern: value });
  }

  function onChangeFailMessagePattern(value) {
    setAttributes({ failMessagePattern: value });
  }

  function onChangeBannedMessagePattern(value) {
    setAttributes({ bannedMessagePattern: value });
  }

  function onChangeTextareaField(value) {
    setAttributes({ bannedStates: value });
  }

  return (
    <div {...blockProps}>
      {/* <BlockControls>
        <AlignmentToolbar
          value={props.attributes.theAlignment}
          onChange={(x) => props.setAttributes({ theAlignment: x })}
        />
      </BlockControls> */}
      <InspectorControls>
        <PanelBody title="Settings" initialOpen={true}>
          {hasResolved ? (
            <>
              <SelectControl
                label="Success Message Pattern"
                value={successMessagePattern}
                options={options}
                onChange={onChangeSuccessMessagePattern}
              />
              <SelectControl
                label="Fail Message Pattern"
                value={failMessagePattern}
                options={options}
                onChange={onChangeFailMessagePattern}
              />
              <SelectControl
                label="Banned Message Pattern"
                value={bannedMessagePattern}
                options={options}
                onChange={onChangeBannedMessagePattern}
              />
            </>
          ) : (
            <div style={{ marginBottom: "10px" }}>
              Loading Patterns
              <Spinner />
            </div>
          )}
          <TextareaControl
            label="Banned States"
            help="Enter name of states separated with comma. Ex: Hawaii, Alaska"
            value={bannedStates}
            onChange={(value) => onChangeTextareaField(value)}
          />
        </PanelBody>
      </InspectorControls>
      <div>
        <label for="name">Zip Code:</label>
        <input type="number" min="1" step="1" />
        <button>Submit</button>
        {/* <InputControl />
        <Button variant="primary">Submit</Button> */}
      </div>
      {/* <InnerBlocks template={MY_TEMPLATE} templateLock="all" /> */}
    </div>
  );
}
