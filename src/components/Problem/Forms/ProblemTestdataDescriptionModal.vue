<template>
  <input type="checkbox" id="testdata-description" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">How to pack testdata</h3>
      <p class="mt-4">
        Put all the input/output files in a single `.zip` file, and follow the naming rules below.
      </p>
      <p class="mt-2">
        Name the input file as <code>sstt.in</code>, where <code>ss</code> represents the number of subtasks
        it belongs to, and <code>tt</code> represents which testcase it is in subtask.
      </p>
      <p class="mt-2">
        Similarly, name the ouput file as <code>sstt.out</code>.
        <br />
        Note that <code>ss</code> & <code>tt</code> are zero-indexed.
      </p>
      <p class="mt-2">
        For example, a problem with 3 subtasks, and the number of testcases of each subtask is 3, 5, 15,
        respectively.
        <br />
        The content of zip file is:
      </p>
      <pre class="mt-2"><code>{{ [
          "0000.in",
          "0000.out",
          "0001.in",
          "0001.out",
          "0002.in",
          "0002.out",
          "0100.in",
          "0100.out",
          "...",
          "0104.in",
          "0104.out",
          "0200.in",
          "0200.out",
          "...",
          "0214.in",
          "0214.out",
        ].join('\n') }}</code></pre>
      <div class="modal-action">
        <label for="testdata-description" class="btn">Got it</label>
      </div>
    </div>
  </div>
</template>
