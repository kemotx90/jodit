/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Released under MIT see LICENSE.txt in the project root for license information.
 * Copyright (c) 2013-2022 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { assert } from 'jodit/core/helpers/utils/assert';
import { isFunction } from 'jodit/core/helpers/checker/is-function';

/**
 * [[include:core/decorators/component/README.md]]
 * @packageDocumentation
 * @module decorators/component
 */

interface ComponentCompatible {
	new (...constructorArgs: any[]): any;
}

/**
 * Decorate components and set status isReady after constructor
 * @param constructorFunction - Component constructor class
 */
export function component<T extends ComponentCompatible>(
	constructorFunction: T
): T {
	assert(
		isFunction(constructorFunction.prototype.className),
		'Component decorator can be used only for component classes'
	);

	class newConstructorFunction extends constructorFunction {
		constructor(...args: any[]) {
			super(...args);

			const isRootConstructor =
				this.constructor === newConstructorFunction;

			// We can add a decorator to multiple classes in a chain.
			// Status should be set only as root
			if (isRootConstructor) {
				// In some es/minimizer builds, JS instantiates the original class rather than the new constructor
				if (!(this instanceof newConstructorFunction)) {
					Object.setPrototypeOf(
						this,
						newConstructorFunction.prototype
					);
				}

				this.setStatus('ready');
			}
		}
	}

	return newConstructorFunction;
}
