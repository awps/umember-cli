module.exports = {
    js: `const { __ } = wp.i18n

export const settings = {
    name:         'umember/__DIRNAME__',
    title:        __( '__TITLE__' ),
    modalOptions: {},
    sideOptions:  {},
}
`,
    jsPublic: `import Block from "src/js/blocks/main/Block";

new Block('__DIRNAME__', block => {
    // Scripts for public
})
`,
    blade: `<div class="umember-block umember-block--__DIRNAME__" data-umember-block="__DIRNAME__">
    <pre>
        <?php print_r(htmlentities(var_export(umember_block_attributes(), true)) . PHP_EOL); ?>
    </pre>
</div>`,
    scss: `.umember-block--__DIRNAME__{
    position: relative;
}`,
    php: `<?php

namespace uMember\\Blocks\\__NS_SUFFIX__;

use uMember\\Builder\\AbstractConfigLoader;

class Config extends AbstractConfigLoader
{
    public function enqueue()
    {
        wp_enqueue_style(
            'umember-block--__DIRNAME__',
            UMEMBER_URL . "css/blocks/__DIRNAME__.css",
            [],
            UMEMBER_VERSION
        );
        wp_enqueue_script(
            'umember-block--__DIRNAME__',
            UMEMBER_URL . "js/blocks/__DIRNAME__.js",
            [],
            UMEMBER_VERSION,
            true
        );
    }

    public function customCss()
    {
        // Custom CSS
    }
}

`,
    scope: `<component name="DependencyValidationManager">
  <scope name="block:__BLOCK_NAME__" pattern="file[__PROJECT_NAME__]:src/blocks/__BLOCK_NAME__//*" />
</component>`
}
