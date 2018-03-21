import manifest from '@neos-project/neos-ui-extensibility';
import {$get} from 'plow-js';
import {selectors} from '@neos-project/neos-ui-redux-store';

// Taken from here, as it's not exposed: '@neos-project/neos-ui-redux-store/src/CR/Nodes/helpers';
const parentNodeContextPath = contextPath => {
    if (typeof contextPath !== 'string') {
        return null;
    }

    const [path, context] = contextPath.split('@');

    if (path.length === 0) {
        // we are at top level; so there is no parent anymore!
        return false;
    }

    return `${path.substr(0, path.lastIndexOf('/'))}@${context}`;
};

manifest('Internezzo.ChildReload:ChildReload', {}, globalRegistry => {
    const serverFeedbackHandlers = globalRegistry.get('serverFeedbackHandlers');
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');

    const handleReload = (feedbackPayload, {store}) => {
        const state = store.getState();

        // Search up the node tree, starting with the currently modified node from feedback
        let currentNodeContextPath = feedbackPayload.contextPath;
        while (true) {
            const getNodeByContextPathSelector = selectors.CR.Nodes.makeGetNodeByContextPathSelector(currentNodeContextPath);
            const node = getNodeByContextPathSelector(state);
            const nodeTypeName = $get('nodeType', node);
            const nodeTypeDefinition = nodeTypesRegistry.getNodeType(nodeTypeName);

            // If any of the parents' nodetype has `ui.reloadIfChildChanged` configured, then reload the iframe
            if ($get('options.reloadIfChildChanged', nodeTypeDefinition)) {
                [].slice.call(document.querySelectorAll(`iframe[name=neos-content-main]`)).forEach(iframe => {
                    const iframeWindow = iframe.contentWindow || iframe;
                    iframeWindow.location.reload();
                });
                break;
            }
            // Don't traverse higher then the first found document node
            const isDocument = nodeTypesRegistry.hasRole(nodeTypeName, 'document');
            if (isDocument) {
                break;
            }
            currentNodeContextPath = parentNodeContextPath(currentNodeContextPath);
        }
    };

    // We need to run after the main NodeCreated feedback on creation
    serverFeedbackHandlers.set('Neos.Neos.Ui:NodeCreated/ChildReload', handleReload, 'after Neos.Neos.Ui:NodeCreated/Main');
    // We need to run before the main NodeCreated feedback on removal
    serverFeedbackHandlers.set('Neos.Neos.Ui:RemoveNode/ChildReload', handleReload, 'before Neos.Neos.Ui:RemoveNode/Main');
});
