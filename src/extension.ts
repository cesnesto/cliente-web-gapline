// Directiva para indicar que el código debe ejecutarse en modo estricto
'use strict';
// Importa el módulo y referencia con alias vscode
import * as vscode from 'vscode';
// El método activate es llamado cuando la extensión es activada, al ser ejecutado por primera vez 
export function activate(context: vscode.ExtensionContext) {
	// Implementa la funcionalidad del comando definido en el archivo package.json
	let disposable = vscode.commands.registerCommand('extension.gapline', () => {
		// Obtiene la instancia de VS Code que se esta ejecutando actualmente
		var editor = vscode.window.activeTextEditor;
		// Si no encuentra el editor retorna sin más instrucciones
		if (!editor) { return; }
		// Obtiene la selección actual del editor
		var selection = editor.selection;
		// Obtiene el bloque de texto seleccionado del editor
		var text = editor.document.getText(selection);
		// Muestra un cuadro de díalogo 
		// Solicita el número de líneas a tomar en cuenta para insertar una línea en blanco
		// Ejecuta la funcionalidad con el valor ingresado
		vscode.window.showInputBox({ prompt: 'Lineas?' }).then(value => {
			// Asigna el valor del cuadro de diálogo a la variable de bloque numberOfLines convirtiendola a entero
			let numberOfLines = +value;
			// Define un array vacio de cadenas de texto
			var textInChunks: Array<string> = [];
			// Divide el texto a partir de cada salto de línea en un array para iterarlas            
			// Implementa la funcionalidad que agrega las líneas en blanco
			text.split('\n').forEach((currentLine: string, lineIndex) => {
				// Agrega la línea actual al array textInChuncks
				textInChunks.push(currentLine);
				// Verifica si la posición en la que está corresponde al número de líneas
				// Si cumple ingresa un texto vacio al array                
				if ((lineIndex + 1) % numberOfLines === 0) { textInChunks.push(''); }
			});
			// Une cada item de array en un solo texto con un salto de línea
			text = textInChunks.join('\n');
			// Implementa la funcionalidad para editar el texto seleccionado
			editor.edit((editBuilder) => {
				// Genera un rango tomando en cuenta los parámetros de la selección
				var range = new vscode.Range(
					// Número inicial de línea y columna
					selection.start.line, 0,
					// Número final de línea
					selection.end.line,
					// Número final de columna
					editor.document.lineAt(selection.end.line).text.length
				);
				// Reemplaza todo lo que está en el rango antes definido con el nuevo texto
				editBuilder.replace(range, text);
			});
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {
}