require = require('esm')(module);
const chai = require('chai');
const { expect } = chai;
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const func = require('../src/functions');

describe('Conver String To Pascal Case', function () {
	it(`returns 'Pascal' with input 'pascal'`, function () {
		expect(func.toPascalCase('pascal')).to.equal('Pascal');
	});
	it(`returns 'Pascal-Again' with input 'pascal-again'`, function () {
		expect(func.toPascalCase('pascal-again')).to.equal('Pascal-Again');
	});
	it(`returns 'Pascal Again' with input 'pascal again'`, function () {
		expect(func.toPascalCase('pascal again')).to.equal('Pascal Again');
	});
});

describe('GENERATING SERVER', function () {
	describe('ADDING ROUTING INDEX', function () {
		const srcpath = path.join(__dirname, '../server/routes/index.js');
		const sample = 'index.js';
		const destpath = path.join(process.cwd(), sample);
		const modelName = 'sample';

		before(function () {
			fse.copySync(srcpath, destpath);
		});
		after(function () {
			fse.removeSync(destpath);
		});

		it('successfully inserts routing to index file', function () {
			const original = fs.readFileSync(destpath, 'utf8');
			func.routeSource(sample, modelName);
			const replaced = fs.readFileSync(destpath, 'utf8');

			expect(replaced).to.not.equal(original);
		});
	});

	describe('ADDING ROUTING FILE', function () {
		const destrelpath = 'index.js';
		const modelName = 'sample';
		const dirpath = path.join(process.cwd(), destrelpath);
		const dirname = path.join(__dirname, '../src/functions');

		describe('ADDING ROUTING', function () {
			const srcrelpath = '../../src/templates/template-route.js';
			const srcpath = path.join(dirname, srcrelpath);
			const srcFile = fs.readFileSync(srcpath, 'utf8');

			after(function () {
				fse.removeSync(dirpath);
			});

			it('successfully adds routing folder and files from template with injected model name', function () {
				const feedback = func.addRouting(srcrelpath, destrelpath, modelName);

				expect(fse.existsSync(dirpath)).to.equal(true);
				expect(fs.readFileSync(dirpath, 'utf8')).to.not.equal(srcFile);
				expect(feedback).to.be.an('object');
				expect(feedback).to.have.property('message');
				expect(feedback.message).to.equal('File has been created.');
			});

			it('fails adding routing folder and files from template with injected model name', function () {
				try {
					const feedback = func.addRouting(srcrelpath, destrelpath, modelName);
					expect(feedback).to.be.an('object');
					expect(feedback).to.have.property('message');
				} catch (error) {
					expect(error.message).to.equal(
						'File already exists, remove or rename file first'
					);
				}
			});
		});
	});

	describe('ADDING NEW MODEL CONTROLLER, SCHEMA, GENERATING DOC', function () {
		const destrelpath = 'index.js';
		const modelName = 'sample';
		const dirpath = path.join(process.cwd(), destrelpath);
		const dirname = path.join(__dirname, '../src/functions');
		const attributes = [
			{
				name: 'title',
				type: 'string',
			},
			{
				name: 'description',
				type: 'string',
			},
			{
				name: 'photo',
				type: 'image',
			},
			{
				name: 'score',
				type: 'number',
			},
			{
				name: 'isOld',
				type: 'boolean',
			},
		];

		describe('ADDING NEW MODEL CONTROLLER', function () {
			const srcrelpath = '../../src/templates/template-controller.js';
			const srcpath = path.join(dirname, srcrelpath);
			const srcFile = fs.readFileSync(srcpath, 'utf8');

			after(function () {
				fse.removeSync(dirpath);
			});

			it('successfully adds new model controller file from template with injected model name', function () {
				const feedback = func.addController(
					srcrelpath,
					destrelpath,
					modelName,
					attributes
				);

				expect(fse.existsSync(dirpath)).to.equal(true);
				expect(fs.readFileSync(dirpath, 'utf8')).to.not.equal(srcFile);
				expect(feedback).to.be.an('object');
				expect(feedback).to.have.property('message');
				expect(feedback.message).to.equal('File has been created.');
			});
			it('fails adding new controller file from template', function () {
				try {
					const feedback = func.addController(
						srcrelpath,
						destrelpath,
						modelName,
						attributes
					);
					expect(feedback).to.be.an('object');
					expect(feedback).to.have.property('message');
				} catch (error) {
					expect(error.message).to.equal(
						'File already exists, remove or rename file first'
					);
				}
			});
			it('fails adding new model file from template', function () {
				try {
					const feedback = func.addModel(
						srcrelpath,
						destrelpath,
						modelName,
						attributes
					);
					expect(feedback).to.be.an('object');
					expect(feedback).to.have.property('message');
				} catch (error) {
					expect(error.message).to.equal(
						'File already exists, remove or rename file first'
					);
				}
			});
		});

		describe('ADDING NEW MODEL SCHEMA', function () {
			const srcrelpath = '../../src/templates/template-schema.js';
			const srcpath = path.join(dirname, srcrelpath);
			const srcFile = fs.readFileSync(srcpath, 'utf8');
			after(function () {
				fse.removeSync(dirpath);
			});

			it('successfully adds new model schema file from template with injected model name', function () {
				const feedback = func.addModel(
					srcrelpath,
					destrelpath,
					modelName,
					attributes
				);

				expect(fse.existsSync(dirpath)).to.equal(true);
				expect(fs.readFileSync(dirpath, 'utf8')).to.not.equal(srcFile);
				expect(feedback).to.be.an('object');
				expect(feedback).to.have.property('message');
				expect(feedback.message).to.equal('File has been created.');
			});
			it('fails adding new model schema file from template with injected model name', function () {
				try {
					const feedback = func.addModel(
						srcrelpath,
						destrelpath,
						modelName,
						attributes
					);
					expect(feedback).to.be.an('object');
					expect(feedback).to.have.property('message');
				} catch (error) {
					expect(error.message).to.equal(
						'File already exists, remove or rename file first'
					);
				}
			});
		});

		describe('GENERATE TEST FOR SERVER', function () {
			const srcrelpath = '../../src/templates/template.test.js';
			const srcpath = path.join(dirname, srcrelpath);
			const srcFile = fs.readFileSync(srcpath, 'utf8');

			after(function () {
				fse.removeSync(dirpath);
			});

			it('successfully add test file to server', function () {
				const feedback = func.generateTest(
					srcrelpath,
					destrelpath,
					modelName,
					attributes
				);

				expect(fse.existsSync(dirpath)).to.equal(true);
				expect(fs.readFileSync(dirpath, 'utf8')).to.not.equal(srcFile);
				expect(feedback).to.be.an('object');
				expect(feedback).to.have.property('message');
				expect(feedback.message).to.equal('File has been created.');
			});
			it('fails adding new test file from template', function () {
				try {
					const feedback = func.generateTest(
						srcrelpath,
						destrelpath,
						modelName,
						attributes
					);
					expect(feedback).to.be.an('object');
					expect(feedback).to.have.property('message');
				} catch (error) {
					expect(error.message).to.equal(
						'File already exists, remove or rename file first'
					);
				}
			});
		});

		describe('GENERATING DOCUMENTATION REST API', function () {
			const srcrelpath = '../../src/templates/template-readme.md';
			const srcpath = path.join(dirname, srcrelpath);
			const srcFile = fs.readFileSync(srcpath, 'utf8');
			const mdrel = 'sample.md';
			const mdpath = path.join(process.cwd(), mdrel);

			before(function () {
				fs.writeFileSync(mdpath, '# sample.md');
			});
			afterEach(function () {
				fse.removeSync(mdpath);
			});

			it('successfully generates documentation from template with injected model name', function () {
				const feedback = func.generateDocumentation(
					srcrelpath,
					mdrel,
					modelName,
					attributes
				);

				expect(fse.existsSync(mdpath)).to.equal(true);
				expect(fs.readFileSync(mdpath, 'utf8')).to.not.equal(srcFile);
				expect(feedback).to.be.an('object');
				expect(feedback).to.have.property('message');
				expect(feedback.message).to.equal('Readme has been generated.');
			});
			it('fails generating documentation from template with injected model name', function () {
				try {
					const feedback = func.generateDocumentation(
						srcrelpath,
						mdrel,
						modelName,
						attributes
					);
					expect(feedback).to.be.an('object');
					expect(feedback).to.have.property('message');
				} catch (error) {
					expect(error.message).to.equal('Readme.md does not exist');
				}
			});
		});
	});
});
