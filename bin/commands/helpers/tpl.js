module.exports = {
    settings: `import edit from './edit'

const {__} = wp.i18n

export const settings = {
    name: 'umember/__DIRNAME__',
    title: __('__TITLE__', 'umember'),
    icon: {
        src: 'grid-view',
        size: 20,
    },
    edit
}`,
    edit: `import uMemberComponent from "src/js/blocks/uMemberComponent";

export default class Edit extends uMemberComponent {

    constructor() {
        super(...arguments);

        this.state = {
            hello: 'Hello World!',
        };
    }

    render() {
        return (<div>{this.state.hello}</div>);
    }
}
`,
    public: `import Block from "../../js/main/Block";

new Block('__DIRNAME__', block => {
    // Scripts for public
})
`,
    blade: `<div <?php echo umember_block_html_attributes(); ?>>
    <pre>
        <?php print_r(htmlentities(var_export(umember_block_attributes(), true)) . PHP_EOL); ?>
    </pre>
</div>`,
    scss: `.umember-block-__DIRNAME__{
    position: relative;
}`,
    php: `<?php

namespace uMember\\Blocks\\__NS_SUFFIX__;

use uMember\\Builder\\AbstractConfigLoader;

class Config extends AbstractConfigLoader
{
   public function adminEnqueue()
    {
    }

    public function enqueue()
    {
    }

    public function customCss()
    {
    }

    public function data()
    {
    }
}

`,
    scope: `<component name="DependencyValidationManager">
  <scope name="block:__BLOCK_NAME__" pattern="file[__PROJECT_NAME__]:src/blocks/__BLOCK_NAME__//*" />
</component>`
}
