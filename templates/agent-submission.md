# AI Agent 考核请求模板

通常不需要填写长模板。完成一章后，把代码放在对应章节目录中，例如 `works/chapter01/typed-toolbox-lab`，然后直接对 AI Agent 说：

```text
考核第 X 章作业
```

也可以写成：

```text
检查第 X 章作业
打分 chapter-XX
```

Agent 会优先检查 `works/chapterXX/typed-toolbox-lab`，读取文件、运行本章要求的命令，并根据对应 rubric 打分。

如果你有卡住的地方，可以在请求后面补充：

```text
考核第 1 章作业。我不确定类型推断和类型注解的区别是否理解对了。
```

## 我希望 Agent 重点检查

例如：

- 我的 `tsconfig.json` 是否合理
- 我的函数类型是否写对
- 我的项目结构是否符合要求
- 我的错误处理是否合理
