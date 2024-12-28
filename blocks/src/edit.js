import {
  TextControl,
  Flex,
  FlexBlock,
  FlexItem,
  Button,
  Icon
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
import { useBlockProps } from "@wordpress/block-editor";

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
export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();

  function deleteAnswer(indexToDelete) {
    const newSite = attributes.sites.filter(function (x, index) {
      return index != indexToDelete;
    });
    setAttributes({ sites: newSite });
  }

  return (
    <div {...blockProps}>
      {attributes.sites.map(function (answer, index) {
        return (
          <Flex>
            <FlexBlock>
              <TextControl
                autoFocus={answer == undefined}
                value={answer}
                placeholder="Site URL"
                onChange={(newValue) => {
                  const newSite = attributes.sites.concat([]);
                  newSite[index] = newValue;
                  setAttributes({ sites: newSite });
                }}
              />
            </FlexBlock>
            <FlexItem>
              <Button
                isLink
                className="attention-delete"
                onClick={() => deleteAnswer(index)}
              >
                Delete
              </Button>
            </FlexItem>
          </Flex>
        );
      })}
      <Button
        isPrimary
        onClick={() => {
          setAttributes({
            sites: attributes.sites.concat([undefined])
          });
        }}
      >
        Add New Site
      </Button>
    </div>
  );
}
