module.exports = (plop) => {
  plop.setGenerator('component', {
    description: 'Create a component',
    prompts: [
      {
        type: 'list',
        name: 'atomic',
        message: 'Choose atomic?',
        choices: [
          { name: 'atom', value: 'atom' },
          { name: 'molecule', value: 'molecule' },
          { name: 'organism', value: 'organism' },
          { name: 'template', value: 'template' },
          { name: 'page', value: 'page' },
        ],
      },
      {
        type: 'input',
        name: 'name',
        message: 'What is the component {name}? => src/component/{atomic}/{dirname}/{name}',
      },
    ],
    actions: (data) => {
      const path = `../src/component/${data.atomic}/`;

      switch (data.atomic) {
        case 'atom':
          return [
            {
              type: 'add',
              path: path + '{{pascalCase name}}/index.ts',
              templateFile: 'template/atom.index.ts.hbs',
            },
            {
              type: 'add',
              path: path + '{{pascalCase name}}/{{pascalCase name}}.tsx',
              templateFile: 'template/atom.component.tsx.hbs',
            },
            {
              type: 'add',
              path: path + '{{pascalCase name}}/{{pascalCase name}}.stories.tsx',
              templateFile: 'template/atom.stories.tsx.hbs',
            },
          ];
        case 'molecule':
          return [
            {
              type: 'add',
              path: path + '{{pascalCase name}}/index.ts',
              templateFile: 'template/molecule.index.ts.hbs',
            },
            {
              type: 'add',
              path: path + '{{pascalCase name}}/{{pascalCase name}}.tsx',
              templateFile: 'template/molecule.component.tsx.hbs',
            },
            {
              type: 'add',
              path: path + '{{pascalCase name}}/{{pascalCase name}}.type.ts',
              templateFile: 'template/molecule.type.ts.hbs',
            },
            {
              type: 'add',
              path: path + '{{pascalCase name}}/{{pascalCase name}}.props.ts',
              templateFile: 'template/molecule.props.ts.hbs',
            },
            {
              type: 'add',
              path: path + '{{pascalCase name}}/{{pascalCase name}}.test.tsx',
              templateFile: 'template/molecule.test.tsx.hbs',
            },
            {
              type: 'add',
              path: path + '{{pascalCase name}}/{{pascalCase name}}.stories.tsx',
              templateFile: 'template/molecule.stories.tsx.hbs',
            },
          ];
        case 'organism':
          return [
            {
              type: 'add',
              path: path + '{{pascalCase name}}/index.ts',
              templateFile: 'template/organism.index.ts.hbs',
            },
            {
              type: 'add',
              path: path + '{{pascalCase name}}/{{pascalCase name}}.tsx',
              templateFile: 'template/organism.component.tsx.hbs',
            },
            {
              type: 'add',
              path: path + '{{pascalCase name}}/{{pascalCase name}}.type.ts',
              templateFile: 'template/organism.type.ts.hbs',
            },
            {
              type: 'add',
              path: path + '{{pascalCase name}}/{{pascalCase name}}.props.ts',
              templateFile: 'template/organism.props.ts.hbs',
            },
            {
              type: 'add',
              path: path + '{{pascalCase name}}/{{pascalCase name}}.test.tsx',
              templateFile: 'template/organism.test.tsx.hbs',
            },
            {
              type: 'add',
              path: path + '{{pascalCase name}}/{{pascalCase name}}.stories.tsx',
              templateFile: 'template/organism.stories.tsx.hbs',
            },
          ];
        case 'template':
          return [
            {
              type: 'add',
              path: path + '{{pascalCase name}}/index.tsx',
              templateFile: 'template/template.index.tsx.hbs',
            },
            {
              type: 'add',
              path: path + '{{pascalCase name}}/{{pascalCase name}}.tsx',
              templateFile: 'template/template.component.tsx.hbs',
            },
            {
              type: 'add',
              path: path + '{{pascalCase name}}/{{pascalCase name}}.type.ts',
              templateFile: 'template/template.type.ts.hbs',
            },
            {
              type: 'add',
              path: path + '{{pascalCase name}}/{{pascalCase name}}.props.ts',
              templateFile: 'template/template.props.ts.hbs',
            },
            {
              type: 'add',
              path: path + '{{pascalCase name}}/{{pascalCase name}}.test.tsx',
              templateFile: 'template/template.test.tsx.hbs',
            },
            {
              type: 'add',
              path: path + '{{pascalCase name}}/{{pascalCase name}}.stories.tsx',
              templateFile: 'template/template.stories.tsx.hbs',
            },
          ];
        case 'page':
          return [
            {
              type: 'add',
              path: '../src/pages/{{kebabCase name}}.tsx',
              templateFile: 'template/page.tsx.hbs',
            },
            {
              type: 'add',
              path: '../src/__test__/unit/page/{{pascalCase name}}.test.tsx',
              templateFile: 'template/page.test.tsx.hbs',
            },
          ];
        default:
          return [];
      }
    },
  });
};
