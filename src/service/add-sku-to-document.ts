/* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call */
import type {
  DocumentNode,
  FieldNode,
  OperationDefinitionNode,
  SelectionNode,
} from '@0no-co/graphql.web';

const hasPricesField = (selections: readonly SelectionNode[]): boolean => {
  return selections.some((selection) => {
    if (selection.kind !== 'Field') return false;

    if (selection.name.value === 'prices') {
      return true;
    }

    if (selection.selectionSet?.selections) {
      return hasPricesField(selection.selectionSet.selections);
    }

    return false;
  });
};

const hasSkuField = (selections: readonly SelectionNode[]): boolean => {
  return selections.some((selection) => {
    if (selection.kind !== 'Field') return false;

    if (selection.name.value === 'sku') {
      return true;
    }

    if (selection.selectionSet?.selections) {
      return hasSkuField(selection.selectionSet.selections);
    }

    return false;
  });
};

const addSkuToSelections = (selections: readonly SelectionNode[]): SelectionNode[] => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!selections) return [];

  let modifiedSelections = selections.map((selection) => {
    if (selection.kind !== 'Field' || !selection.selectionSet) {
      return selection;
    }

    return {
      ...selection,
      selectionSet: {
        ...selection.selectionSet,
        selections: addSkuToSelections(selection.selectionSet.selections),
      },
    };
  });

  if (hasPricesField(modifiedSelections) && !hasSkuField(modifiedSelections)) {
    modifiedSelections = [
      ...modifiedSelections,
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      {
        kind: 'Field',
        name: { kind: 'Name', value: 'sku' },
      } as FieldNode,
    ];
  }

  return modifiedSelections;
};

const addSkuToDocument = (document: DocumentNode): DocumentNode => {
  const firstDefinition = document.definitions[0];

  if (firstDefinition?.kind === 'OperationDefinition' && firstDefinition.operation !== 'query') {
    return document;
  }

  return {
    ...document,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    definitions: document.definitions.map((definition: any) => {
      if (definition.kind === 'OperationDefinition') {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const opDef = definition as OperationDefinitionNode;

        if (opDef.operation === 'query' && opDef.selectionSet) {
          return {
            ...opDef,
            selectionSet: {
              ...opDef.selectionSet,
              selections: addSkuToSelections(opDef.selectionSet.selections),
            },
          };
        }
      } else if (definition.kind === 'FragmentDefinition') {
        return {
          ...definition,
          selectionSet: {
            ...definition.selectionSet,
            selections: addSkuToSelections(definition.selectionSet.selections),
          },
        };
      }

      return definition;
    }),
  };
};

export default addSkuToDocument;
