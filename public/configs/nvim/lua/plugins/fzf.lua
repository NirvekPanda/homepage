return {
  {
    "ibhagwan/fzf-lua",
    dependencies = { "nvim-tree/nvim-web-devicons" },
    config = function()
      local fzf = require("fzf-lua")
      
      fzf.setup({
        defaults = {
          formatter = "path.filename_first",
        },
      })
      
      -- Key mappings
      vim.keymap.set("n", "<leader>ff", fzf.files, { noremap = true })
      vim.keymap.set("n", "<leader>fg", fzf.live_grep, { noremap = true })
      vim.keymap.set("n", "<leader>fb", fzf.buffers, { noremap = true })
      vim.keymap.set("n", "<leader>fh", fzf.help_tags, { noremap = true })
      vim.keymap.set("n", "<leader>fc", fzf.commands, { noremap = true })
      vim.keymap.set("n", "<leader>gf", fzf.git_files, { noremap = true })
    end,
  },
}

